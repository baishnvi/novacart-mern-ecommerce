import { useEffect, useState } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { DollarSign, ShoppingBag, Package, Users } from "lucide-react";
import { adminService } from "../../services/cartService";
import { formatCurrency, formatDate } from "../../utils/formatters";
import Badge from "../../components/ui/Badge";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler);

const statusTones = {
  pending: "warning",
  processing: "gold",
  shipped: "neutral",
  delivered: "success",
  cancelled: "danger",
  refunded: "danger",
};

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="card-surface flex items-center gap-4 p-5">
    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-ivory dark:bg-cream dark:text-ink">
      <Icon size={18} />
    </div>
    <div>
      <p className="text-xs text-stone">{label}</p>
      <p className="text-xl font-semibold tabular-nums">{value}</p>
    </div>
  </div>
);

const AdminAnalyticsPage = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminService.getDashboardStats().then((res) => setStats(res.data));
  }, []);

  if (!stats) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const revenueChartData = {
    labels: stats.revenueByDay.map((d) => d._id),
    datasets: [
      {
        label: "Revenue",
        data: stats.revenueByDay.map((d) => d.revenue),
        borderColor: "#B08D57",
        backgroundColor: "rgba(176,141,87,0.12)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const statusChartData = {
    labels: stats.ordersByStatus.map((s) => s._id),
    datasets: [
      {
        data: stats.ordersByStatus.map((s) => s.count),
        backgroundColor: ["#B08D57", "#0B0B0A", "#8A8580", "#C9A66B", "#E8E5DE", "#6B6560"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <span className="eyebrow">Overview</span>
        <h1 className="mt-1 font-display text-3xl tracking-tightest">Analytics</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={DollarSign} label="Total Revenue" value={formatCurrency(stats.totalRevenue)} />
        <StatCard icon={ShoppingBag} label="Total Orders" value={stats.totalOrders} />
        <StatCard icon={Package} label="Total Products" value={stats.totalProducts} />
        <StatCard icon={Users} label="Total Customers" value={stats.totalUsers} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="card-surface p-6">
          <h3 className="mb-4 font-display text-lg">Revenue (Last 14 Days)</h3>
          <Line
            data={revenueChartData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } },
            }}
          />
        </div>
        <div className="card-surface p-6">
          <h3 className="mb-4 font-display text-lg">Orders by Status</h3>
          <Doughnut data={statusChartData} options={{ plugins: { legend: { position: "bottom" } } }} />
        </div>
      </div>

      <div className="card-surface p-6">
        <h3 className="mb-4 font-display text-lg">Recent Orders</h3>
        <div className="flex flex-col divide-y divide-hairline dark:divide-hairline-dark">
          {stats.recentOrders.map((order) => (
            <div key={order._id} className="flex items-center justify-between py-3 text-sm">
              <div>
                <p className="font-medium">{order.orderNumber}</p>
                <p className="text-xs text-stone">
                  {order.user?.name} · {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge tone={statusTones[order.orderStatus]}>{order.orderStatus}</Badge>
                <span className="font-semibold tabular-nums">{formatCurrency(order.totalPrice)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
