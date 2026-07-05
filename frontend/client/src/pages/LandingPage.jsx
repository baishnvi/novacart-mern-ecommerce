import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Star, Plus, Minus } from "lucide-react";
import Hero from "../components/layout/Hero";
import ProductGrid from "../components/product/ProductGrid";
import { productService, categoryService } from "../services/productService";
import { toast } from "react-toastify";

const perks = [
  { icon: Truck, title: "Free Shipping", desc: "On all orders over $100" },
  { icon: RefreshCw, title: "Easy Returns", desc: "30-day hassle-free returns" },
  { icon: ShieldCheck, title: "Secure Checkout", desc: "Protected by Stripe encryption" },
];

const testimonials = [
  {
    name: "Amara Chen",
    role: "Verified Buyer",
    quote:
      "The quality is genuinely on par with brands charging three times as much. My go-to for basics now.",
  },
  {
    name: "Diego Fuentes",
    role: "Verified Buyer",
    quote: "Fast shipping, true-to-size fit, and the packaging alone felt premium. Will keep ordering.",
  },
  {
    name: "Priya Nair",
    role: "Verified Buyer",
    quote: "Customer support resolved my exchange in minutes. Rare to find that kind of service anymore.",
  },
];

const faqs = [
  {
    q: "What is your return policy?",
    a: "We offer a 30-day return window on all unworn items with original tags attached. Refunds are processed within 5-7 business days of receiving your return.",
  },
  {
    q: "How long does shipping take?",
    a: "Standard shipping takes 3-5 business days within the continental US. Express options are available at checkout for 1-2 day delivery.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes, we ship to over 40 countries. International delivery times and customs fees vary by destination.",
  },
  {
    q: "How do I track my order?",
    a: "Once your order ships, you'll receive a tracking link by email. You can also view live status from your NovaCart dashboard.",
  },
];

const FaqItem = ({ item, isOpen, onClick }) => (
  <div className="border-b border-hairline py-6 dark:border-hairline-dark">
    <button onClick={onClick} className="flex w-full items-center justify-between text-left">
      <span className="font-display text-lg text-ink dark:text-cream">{item.q}</span>
      {isOpen ? <Minus size={18} className="text-stone" /> : <Plus size={18} className="text-stone" />}
    </button>
    {isOpen && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone">{item.a}</p>}
  </div>
);

const SectionHeading = ({ eyebrow, title, ctaLabel, ctaTo }) => (
  <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
    <div>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="mt-2 font-display text-3xl tracking-tightest text-ink dark:text-cream sm:text-4xl">
        {title}
      </h2>
    </div>
    {ctaLabel && (
      <Link
        to={ctaTo}
        className="group flex items-center gap-1.5 text-sm font-medium text-ink dark:text-cream"
      >
        {ctaLabel}
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
      </Link>
    )}
  </div>
);

const LandingPage = () => {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(0);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [featuredRes, trendingRes, newRes, catRes] = await Promise.all([
          productService.getCollection("featured", 8),
          productService.getCollection("trending", 8),
          productService.getCollection("new-arrivals", 4),
          categoryService.getCategories(),
        ]);
        setFeatured(featuredRes.data);
        setTrending(trendingRes.data);
        setNewArrivals(newRes.data);
        setCategories(catRes.data);
      } catch (err) {
        // sections simply stay empty if the API isn't reachable yet
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("You're on the list — welcome to NovaCart");
    setEmail("");
  };

  return (
    <div>
      <Hero />

      <section className="border-y border-hairline bg-cream/40 dark:border-hairline-dark dark:bg-white/[0.02]">
        <div className="container-page grid grid-cols-1 gap-8 py-10 sm:grid-cols-3">
          {perks.map((perk) => (
            <div key={perk.title} className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink text-ivory dark:bg-cream dark:text-ink">
                <perk.icon size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink dark:text-cream">{perk.title}</p>
                <p className="text-xs text-stone">{perk.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-16 lg:py-24">
        <SectionHeading eyebrow="Curated Edit" title="Featured Products" ctaLabel="View All" ctaTo="/shop" />
        <ProductGrid products={featured} isLoading={isLoading} emptyMessage="Featured products coming soon" />
      </section>

      {categories.length > 0 && (
        <section className="container-page pb-16 lg:pb-24">
          <SectionHeading eyebrow="Explore" title="Shop by Category" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {categories.slice(0, 4).map((cat) => (
              <Link
                key={cat._id}
                to={`/shop?category=${cat._id}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-xl2 bg-ink/5"
              >
                {cat.image?.url && (
                  <img
                    src={cat.image.url}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-700 ease-premium group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 font-display text-xl text-ivory">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="bg-ink py-16 text-ivory dark:bg-white/5 lg:py-24">
        <div className="container-page">
          <SectionHeading eyebrow="Right Now" title="Trending This Week" ctaLabel="Shop Trending" ctaTo="/shop?sort=popular" />
          <ProductGrid products={trending} isLoading={isLoading} emptyMessage="Trending products coming soon" />
        </div>
      </section>

      <section className="container-page py-16 lg:py-24">
        <SectionHeading eyebrow="Just Landed" title="New Arrivals" ctaLabel="Shop New" ctaTo="/shop?sort=newest" />
        <ProductGrid products={newArrivals} isLoading={isLoading} emptyMessage="New arrivals coming soon" />
      </section>

      <section className="border-t border-hairline py-16 dark:border-hairline-dark lg:py-24">
        <div className="container-page">
          <SectionHeading eyebrow="Word on the Street" title="What Customers Say" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card-surface flex flex-col gap-4 p-6"
              >
                <div className="flex gap-0.5 text-gold">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-ink/80 dark:text-cream/80">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-stone">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="border-t border-hairline py-16 dark:border-hairline-dark lg:py-24">
        <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div>
            <span className="eyebrow">Need to Know</span>
            <h2 className="mt-2 font-display text-3xl tracking-tightest sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="lg:col-span-2">
            {faqs.map((item, i) => (
              <FaqItem
                key={item.q}
                item={item}
                isOpen={openFaq === i}
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream/50 py-16 dark:bg-white/[0.02] lg:py-24">
        <div className="container-page flex flex-col items-center gap-6 text-center">
          <span className="eyebrow">Stay in the Loop</span>
          <h2 className="max-w-xl font-display text-3xl tracking-tightest sm:text-4xl">
            Get 10% off your first order
          </h2>
          <p className="max-w-md text-sm text-stone">
            Sign up for early access to new drops, private sales, and style edits — no spam, ever.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex w-full max-w-md gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input-field !bg-white"
            />
            <button type="submit" className="btn-primary shrink-0">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
