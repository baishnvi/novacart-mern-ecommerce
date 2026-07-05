import { NavLink, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Package, Heart, User, MapPin, LogOut } from "lucide-react";
import { logoutUser } from "../../features/auth/authSlice";

const navItems = [
  { label: "Orders", to: "/dashboard/orders", icon: Package },
  { label: "Wishlist", to: "/dashboard/wishlist", icon: Heart },
  { label: "Profile", to: "/dashboard/profile", icon: User },
  { label: "Addresses", to: "/dashboard/addresses", icon: MapPin },
];

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="container-page py-10 lg:py-14">
      <div className="mb-8">
        <span className="eyebrow">My Account</span>
        <h1 className="mt-1 font-display text-4xl tracking-tightest">Hi, {user?.name?.split(" ")[0]}</h1>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="flex flex-row gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-ink text-ivory dark:bg-cream dark:text-ink"
                    : "text-ink/70 hover:bg-ink/5 dark:text-cream/70 dark:hover:bg-cream/10"
                }`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={() => dispatch(logoutUser())}
            className="flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </aside>

        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
