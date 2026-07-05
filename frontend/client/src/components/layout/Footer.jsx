import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Youtube } from "lucide-react";

const footerColumns = [
  {
    title: "Shop",
    links: [
      { label: "New Arrivals", to: "/shop?sort=newest" },
      { label: "Men", to: "/shop?category=men" },
      { label: "Women", to: "/shop?category=women" },
      { label: "Footwear", to: "/shop?category=footwear" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", to: "/contact" },
      { label: "Shipping & Returns", to: "/shipping" },
      { label: "FAQ", to: "/#faq" },
      { label: "Track Order", to: "/dashboard/orders" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About NovaCart", to: "/about" },
      { label: "Careers", to: "/careers" },
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-hairline bg-ivory dark:border-hairline-dark dark:bg-charcoal">
      <div className="container-page grid grid-cols-2 gap-10 py-16 sm:grid-cols-2 lg:grid-cols-5 lg:py-20">
        <div className="col-span-2 flex flex-col gap-4 lg:col-span-2">
          <Link to="/" className="font-display text-2xl tracking-tightest">
            NovaCart
          </Link>
          <p className="max-w-xs text-sm text-stone">
            Considered essentials for everyday life — thoughtfully made, honestly priced, delivered fast.
          </p>
          <div className="flex items-center gap-3 pt-2">
            {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink/70 transition-colors hover:border-gold hover:text-gold dark:border-cream/15 dark:text-cream/70"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {footerColumns.map((col) => (
          <div key={col.title}>
            <h4 className="eyebrow mb-4">{col.title}</h4>
            <ul className="flex flex-col gap-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-ink/70 transition-colors hover:text-ink dark:text-cream/70 dark:hover:text-cream"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-hairline dark:border-hairline-dark">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-stone sm:flex-row">
          <p>&copy; {new Date().getFullYear()} NovaCart. All rights reserved.</p>
          <p>Designed with care. Built for everyday life.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
