import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const marqueeWords = ["Tailoring", "Footwear", "Accessories", "Outerwear", "Essentials", "New Season"];

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="container-page grid grid-cols-1 items-center gap-10 pb-16 pt-14 lg:grid-cols-2 lg:gap-16 lg:pb-24 lg:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-6"
        >
          <span className="eyebrow">Spring / Summer Collection</span>
          <h1 className="font-display text-5xl leading-[1.05] tracking-tightest text-ink dark:text-cream sm:text-6xl lg:text-7xl">
            Dressed for
            <br />
            <span className="italic text-gold">the life you</span>
            <br />
            actually live.
          </h1>
          <p className="max-w-md text-base leading-relaxed text-stone">
            Considered essentials — cut from honest materials, priced without the markup games. NovaCart
            exists so getting dressed well doesn't require a compromise.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <Link to="/shop" className="btn-primary">
              Shop the Collection <ArrowRight size={16} />
            </Link>
            <Link to="/shop?sort=newest" className="btn-secondary">
              New Arrivals
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="relative aspect-[4/5] w-full overflow-hidden rounded-xl2 bg-ink/5"
        >
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80"
            alt="NovaCart seasonal editorial"
            className="h-full w-full object-cover"
          />
        </motion.div>
      </div>

      <div className="overflow-hidden border-y border-hairline py-4 dark:border-hairline-dark">
        <div className="flex w-max animate-marquee gap-12">
          {[...marqueeWords, ...marqueeWords].map((word, i) => (
            <span key={i} className="font-display text-lg italic text-stone whitespace-nowrap">
              {word} &nbsp;•
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
