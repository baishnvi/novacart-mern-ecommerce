import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Search, Heart, ShoppingBag, User, Menu, X, Sun, Moon } from "lucide-react";
import { toggleMobileMenu, closeMobileMenu, toggleTheme } from "../../features/ui/uiSlice";
import { openMiniCart } from "../../features/cart/cartSlice";

const navLinks = [
  { label: "New Arrivals", to: "/shop?sort=newest" },
  { label: "Men", to: "/shop?category=men" },
  { label: "Women", to: "/shop?category=women" },
  { label: "Footwear", to: "/shop?category=footwear" },
  { label: "Accessories", to: "/shop?category=accessories" },
];

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { isMobileMenuOpen, theme } = useSelector((state) => state.ui);
  const { totalItems } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchOpen(false);
      setSearchTerm("");
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-hairline bg-ivory/85 backdrop-blur-md dark:border-hairline-dark dark:bg-charcoal/85"
          : "bg-transparent"
      }`}
    >
      <div className="container-page flex h-20 items-center justify-between">
        <button
          onClick={() => dispatch(toggleMobileMenu())}
          className="flex items-center justify-center rounded-full p-2 lg:hidden"
          aria-label="Open menu"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link to="/" className="font-display text-2xl tracking-tightest text-ink dark:text-cream">
          NovaCart
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-sm font-medium text-ink/70 transition-colors hover:text-ink dark:text-cream/70 dark:hover:text-cream"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setSearchOpen((v) => !v)}
            className="rounded-full p-2.5 text-ink/80 transition-colors hover:bg-ink/5 dark:text-cream/80 dark:hover:bg-cream/10"
            aria-label="Search"
          >
            <Search size={19} />
          </button>

          <button
            onClick={() => dispatch(toggleTheme())}
            className="hidden rounded-full p-2.5 text-ink/80 transition-colors hover:bg-ink/5 dark:text-cream/80 dark:hover:bg-cream/10 sm:flex"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          <Link
            to={isAuthenticated ? "/dashboard/wishlist" : "/login"}
            className="hidden rounded-full p-2.5 text-ink/80 transition-colors hover:bg-ink/5 dark:text-cream/80 dark:hover:bg-cream/10 sm:flex"
            aria-label="Wishlist"
          >
            <Heart size={19} />
          </Link>

          <Link
            to={isAuthenticated ? (user?.role === "admin" ? "/admin" : "/dashboard") : "/login"}
            className="rounded-full p-2.5 text-ink/80 transition-colors hover:bg-ink/5 dark:text-cream/80 dark:hover:bg-cream/10"
            aria-label="Account"
          >
            <User size={19} />
          </Link>

          <button
            onClick={() => dispatch(openMiniCart())}
            className="relative rounded-full p-2.5 text-ink/80 transition-colors hover:bg-ink/5 dark:text-cream/80 dark:hover:bg-cream/10"
            aria-label="Cart"
          >
            <ShoppingBag size={19} />
            {totalItems > 0 && (
              <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-ink">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-hairline bg-ivory dark:border-hairline-dark dark:bg-charcoal">
          <form onSubmit={handleSearchSubmit} className="container-page flex items-center gap-3 py-4">
            <Search size={18} className="text-stone" />
            <input
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for products, brands, categories..."
              className="w-full bg-transparent text-base outline-none placeholder:text-stone/60"
            />
          </form>
        </div>
      )}

      {isMobileMenuOpen && (
        <div className="border-t border-hairline bg-ivory px-5 py-6 dark:border-hairline-dark dark:bg-charcoal lg:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => dispatch(closeMobileMenu())}
                className="rounded-lg px-3 py-3 text-base font-medium text-ink transition-colors hover:bg-ink/5 dark:text-cream dark:hover:bg-cream/10"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
