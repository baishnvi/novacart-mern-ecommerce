import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { orderService } from "../../services/cartService";
import { formatCurrency, formatDate } from "../../utils/formatters";
import Badge from "../../components/ui/Badge";

const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled", "refunded"];
const statusTones = {
  pending: "warning",
  processing: "gold",
  shipped: "neutral",
  delivered: "success",
  cancelled: "danger",
  refunded: "danger",
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const res = await orderService.getAllOrders(statusFilter ? { status: statusFilter } : {});
      setOrders(res.data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const handleStatusChange = async (orderId, status) => {
    try {
      await orderService.updateOrderStatus(orderId, { status });
      toast.success("Order status updated");
      loadOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update order status");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="eyebrow">Fulfillment</span>
          <h1 className="mt-1 font-display text-3xl tracking-tightest">Orders</h1>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-full border border-ink/12 bg-transparent px-4 py-2.5 text-sm outline-none dark:border-cream/15"
        >
          <option value="">All Statuses</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="card-surface overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-hairline text-xs uppercase tracking-wide text-stone dark:border-hairline-dark">
              <th className="px-5 py-4">Order</th>
              <th className="px-5 py-4">Customer</th>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Total</th>
              <th className="px-5 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-stone">
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-stone">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="border-b border-hairline last:border-0 dark:border-hairline-dark">
                  <td className="px-5 py-4 font-medium">{order.orderNumber}</td>
                  <td className="px-5 py-4 text-stone">{order.user?.name}</td>
                  <td className="px-5 py-4 text-stone">{formatDate(order.createdAt)}</td>
                  <td className="px-5 py-4 tabular-nums">{formatCurrency(order.totalPrice)}</td>
                  <td className="px-5 py-4">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="rounded-full border border-ink/12 bg-transparent px-3 py-1.5 text-xs outline-none dark:border-cream/15"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
