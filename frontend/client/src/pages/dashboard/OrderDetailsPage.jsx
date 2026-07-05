import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { orderService } from "../../services/cartService";
import { formatCurrency, formatDate } from "../../utils/formatters";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

const statusTones = {
  pending: "warning",
  processing: "gold",
  shipped: "neutral",
  delivered: "success",
  cancelled: "danger",
  refunded: "danger",
};

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadOrder = () => {
    orderService
      .getOrderById(orderId)
      .then((res) => setOrder(res.data))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const handleCancel = async () => {
    try {
      await orderService.cancelOrder(orderId, "Customer requested cancellation");
      toast.success("Order cancelled");
      loadOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not cancel order");
    }
  };

  if (isLoading) return <div className="skeleton h-64 w-full rounded-xl" />;
  if (!order) return <p className="text-sm text-stone">Order not found.</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-xl">{order.orderNumber}</p>
          <p className="text-xs text-stone">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <Badge tone={statusTones[order.orderStatus]}>{order.orderStatus}</Badge>
      </div>

      <div className="card-surface flex flex-col divide-y divide-hairline p-5 dark:divide-hairline-dark">
        {order.items.map((item, i) => (
          <div key={i} className="flex gap-4 py-4 first:pt-0 last:pb-0">
            <img src={item.image} alt={item.name} className="h-20 w-16 rounded-lg object-cover" />
            <div className="flex flex-1 justify-between">
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-stone">
                  {item.color && `${item.color} `}
                  {item.size && `· ${item.size}`} · Qty {item.quantity}
                </p>
              </div>
              <span className="text-sm font-semibold tabular-nums">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="card-surface p-5">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone">Shipping Address</h4>
          <p className="text-sm">{order.shippingAddress.fullName}</p>
          <p className="text-sm text-stone">
            {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>
          <p className="text-sm text-stone">{order.shippingAddress.phone}</p>
        </div>

        <div className="card-surface p-5">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone">Payment Summary</h4>
          <div className="flex flex-col gap-1.5 text-sm">
            <div className="flex justify-between text-stone">
              <span>Items</span>
              <span className="tabular-nums">{formatCurrency(order.itemsPrice)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span className="tabular-nums">-{formatCurrency(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone">
              <span>Tax</span>
              <span className="tabular-nums">{formatCurrency(order.taxPrice)}</span>
            </div>
            <div className="flex justify-between text-stone">
              <span>Shipping</span>
              <span className="tabular-nums">
                {order.shippingPrice === 0 ? "Free" : formatCurrency(order.shippingPrice)}
              </span>
            </div>
            <div className="flex justify-between border-t border-hairline pt-2 font-semibold dark:border-hairline-dark">
              <span>Total</span>
              <span className="tabular-nums">{formatCurrency(order.totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>

      {["pending", "processing"].includes(order.orderStatus) && (
        <Button variant="secondary" onClick={handleCancel} className="w-fit">
          Cancel Order
        </Button>
      )}

      <Link to="/dashboard/orders" className="text-sm text-stone underline-offset-2 hover:underline">
        &larr; Back to Orders
      </Link>
    </div>
  );
};

export default OrderDetailsPage;
