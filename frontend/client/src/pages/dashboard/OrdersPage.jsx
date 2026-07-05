import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { orderService } from "../../services/cartService";
import { formatCurrency, formatDate } from "../../utils/formatters";
import Badge from "../../components/ui/Badge";

const statusTones = {
  pending: "warning",
  processing: "gold",
  shipped: "neutral",
  delivered: "success",
  cancelled: "danger",
  refunded: "danger",
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    orderService
      .getMyOrders()
      .then((res) => setOrders(res.data))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <Package size={36} className="text-stone" strokeWidth={1.25} />
        <p className="text-sm text-stone">You haven't placed any orders yet.</p>
        <Link to="/shop" className="btn-secondary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => (
        <Link
          key={order._id}
          to={`/dashboard/orders/${order._id}`}
          className="card-surface flex flex-col gap-3 p-5 transition-shadow hover:shadow-card sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-sm font-semibold">{order.orderNumber}</p>
            <p className="text-xs text-stone">
              Placed on {formatDate(order.createdAt)} · {order.items.length} item(s)
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge tone={statusTones[order.orderStatus]}>{order.orderStatus}</Badge>
            <span className="text-sm font-semibold tabular-nums">{formatCurrency(order.totalPrice)}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default OrdersPage;
