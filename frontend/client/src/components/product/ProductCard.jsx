import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlistItem } from "../../features/wishlist/wishlistSlice";
import { formatCurrency } from "../../utils/formatters";
import Badge from "../ui/Badge";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const wishlistProducts = useSelector((state) => state.wishlist.products);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [hoveredColor, setHoveredColor] = useState(null);

  const isWished = wishlistProducts.some((p) => p._id === product._id);

  const colorways = useMemo(() => {
    const seen = new Map();
    (product.variants || []).forEach((v) => {
      if (v.color && !seen.has(v.color)) seen.set(v.color, v.colorHex || "#999");
    });
    return Array.from(seen.entries());
  }, [product.variants]);

  const mainImage = product.images?.[0]?.url;
  const hoverImage = product.images?.[1]?.url || mainImage;

  const finalPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const discountPercent =
    product.discountPrice > 0 ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  const handleWishlistClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    dispatch(toggleWishlistItem(product._id));
  };

  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl2 bg-ink/5">
        {mainImage && (
          <>
            <img
              src={mainImage}
              alt={product.images?.[0]?.altText || product.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-premium group-hover:opacity-0"
            />
            <img
              src={hoverImage}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-all duration-500 ease-premium group-hover:scale-100 group-hover:opacity-100"
            />
          </>
        )}

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discountPercent > 0 && <Badge tone="gold">-{discountPercent}%</Badge>}
          {product.isNewArrival && <Badge tone="ink">New</Badge>}
        </div>

        <button
          onClick={handleWishlistClick}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ivory/90 text-ink opacity-0 shadow-soft backdrop-blur-sm transition-all duration-300 group-hover:opacity-100"
          aria-label="Toggle wishlist"
        >
          <Heart size={16} className={isWished ? "fill-gold text-gold" : ""} />
        </button>

        {colorways.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {colorways.slice(0, 5).map(([name, hex]) => (
              <span
                key={name}
                onMouseEnter={() => setHoveredColor(name)}
                onMouseLeave={() => setHoveredColor(null)}
                title={name}
                style={{ backgroundColor: hex }}
                className={`h-4 w-4 rounded-full border-2 transition-transform ${
                  hoveredColor === name ? "scale-125 border-ivory" : "border-ivory/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-3.5 flex flex-col gap-1">
        <p className="text-[11px] uppercase tracking-wide text-stone">{product.brand?.name}</p>
        <h3 className="truncate text-sm font-medium text-ink dark:text-cream">{product.title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tabular-nums text-ink dark:text-cream">
            {formatCurrency(finalPrice)}
          </span>
          {product.discountPrice > 0 && (
            <span className="text-xs tabular-nums text-stone line-through">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
