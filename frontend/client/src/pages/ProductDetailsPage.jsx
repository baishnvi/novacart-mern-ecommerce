import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Star, Heart, Truck, RefreshCw, ShieldCheck, Share2 } from "lucide-react";
import { productService, reviewService } from "../services/productService";
import { addToCart } from "../features/cart/cartSlice";
import { toggleWishlistItem } from "../features/wishlist/wishlistSlice";
import { formatCurrency, formatDate } from "../utils/formatters";
import { ProductDetailsSkeleton } from "../components/skeletons/Skeletons";
import ProductGrid from "../components/product/ProductGrid";
import QuantityStepper from "../components/ui/QuantityStepper";
import Button from "../components/ui/Button";
import { toast } from "react-toastify";

const ProductDetailsPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const wishlistProducts = useSelector((state) => state.wishlist.products);

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      try {
        const res = await productService.getProductBySlug(slug);
        setProduct(res.data.product);
        setRelated(res.data.relatedProducts);
        setActiveImage(0);
        setQuantity(1);

        const colors = [...new Set((res.data.product.variants || []).map((v) => v.color).filter(Boolean))];
        setSelectedColor(colors[0] || null);

        const reviewsRes = await reviewService.getProductReviews(res.data.product._id);
        setReviews(reviewsRes.data);
      } catch (err) {
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) return <ProductDetailsSkeleton />;

  if (!product) {
    return (
      <div className="container-page py-24 text-center">
        <h2 className="font-display text-2xl">Product not found</h2>
        <Link to="/shop" className="btn-secondary mt-6 inline-flex">
          Back to Shop
        </Link>
      </div>
    );
  }

  const colors = [...new Set((product.variants || []).map((v) => v.color).filter(Boolean))];
  const sizesForColor = (product.variants || [])
    .filter((v) => !selectedColor || v.color === selectedColor)
    .map((v) => v.size)
    .filter(Boolean);

  const matchedVariant = (product.variants || []).find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );

  const finalPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const isWished = wishlistProducts.some((p) => p._id === product._id);
  const stock = matchedVariant ? matchedVariant.stock : product.stock;

  const handleAddToCart = () => {
    if (colors.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    dispatch(
      addToCart({
        productId: product._id,
        variantId: matchedVariant?._id,
        quantity,
        color: selectedColor,
        size: selectedSize,
      })
    );
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      toast.info("Please log in to save items");
      return;
    }
    dispatch(toggleWishlistItem(product._id));
  };

  return (
    <div className="container-page py-10 lg:py-14">
      <nav className="mb-8 flex items-center gap-2 text-xs text-stone">
        <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> /{" "}
        <span className="text-ink dark:text-cream">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <div className="aspect-square w-full overflow-hidden rounded-2xl bg-ink/5">
            {product.images?.[activeImage]?.url && (
              <img
                src={product.images[activeImage].url}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="mt-4 flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-20 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                    activeImage === i ? "border-gold" : "border-transparent"
                  }`}
                >
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <p className="text-sm uppercase tracking-wide text-stone">{product.brand?.name}</p>
            <h1 className="mt-1 font-display text-3xl tracking-tightest sm:text-4xl">{product.title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex gap-0.5 text-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={15}
                  fill={i < Math.round(product.ratingsAverage) ? "currentColor" : "none"}
                />
              ))}
            </div>
            <span className="text-sm text-stone">
              {product.ratingsAverage.toFixed(1)} ({product.ratingsCount} reviews)
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-semibold tabular-nums">{formatCurrency(finalPrice)}</span>
            {product.discountPrice > 0 && (
              <span className="text-base tabular-nums text-stone line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          <p className="max-w-lg text-sm leading-relaxed text-stone">{product.shortDescription}</p>

          {colors.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone">
                Color: <span className="text-ink dark:text-cream">{selectedColor}</span>
              </p>
              <div className="flex gap-2">
                {colors.map((color) => {
                  const variant = product.variants.find((v) => v.color === color);
                  return (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color);
                        setSelectedSize(null);
                      }}
                      style={{ backgroundColor: variant?.colorHex || "#999" }}
                      className={`h-9 w-9 rounded-full border-2 transition-transform ${
                        selectedColor === color ? "scale-110 border-gold" : "border-transparent"
                      }`}
                      title={color}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {sizesForColor.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone">Size</p>
              <div className="flex flex-wrap gap-2">
                {[...new Set(sizesForColor)].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`flex h-11 min-w-[44px] items-center justify-center rounded-lg border px-3 text-sm transition-colors ${
                      selectedSize === size
                        ? "border-ink bg-ink text-ivory dark:border-cream dark:bg-cream dark:text-ink"
                        : "border-ink/15 hover:border-ink dark:border-cream/20"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 pt-2">
            <QuantityStepper
              quantity={quantity}
              onIncrease={() => setQuantity((q) => Math.min(q + 1, stock || 99))}
              onDecrease={() => setQuantity((q) => Math.max(q - 1, 1))}
              max={stock || 99}
            />
            <Button onClick={handleAddToCart} disabled={stock === 0} className="flex-1">
              {stock === 0 ? "Out of Stock" : "Add to Bag"}
            </Button>
            <button
              onClick={handleWishlist}
              className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-ink/12 dark:border-cream/15"
              aria-label="Toggle wishlist"
            >
              <Heart size={18} className={isWished ? "fill-gold text-gold" : ""} />
            </button>
            <button
              className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-ink/12 dark:border-cream/15"
              aria-label="Share product"
            >
              <Share2 size={18} />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 border-t border-hairline pt-6 dark:border-hairline-dark sm:grid-cols-3">
            <div className="flex items-center gap-2 text-xs text-stone">
              <Truck size={16} /> Free shipping over $100
            </div>
            <div className="flex items-center gap-2 text-xs text-stone">
              <RefreshCw size={16} /> 30-day returns
            </div>
            <div className="flex items-center gap-2 text-xs text-stone">
              <ShieldCheck size={16} /> Secure checkout
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-hairline pt-10 dark:border-hairline-dark">
        <div className="mb-6 flex gap-8 border-b border-hairline dark:border-hairline-dark">
          {["description", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-medium capitalize transition-colors ${
                activeTab === tab ? "border-b-2 border-gold text-ink dark:text-cream" : "text-stone"
              }`}
            >
              {tab === "reviews" ? `Reviews (${product.ratingsCount})` : "Description"}
            </button>
          ))}
        </div>

        {activeTab === "description" ? (
          <p className="max-w-2xl text-sm leading-relaxed text-stone">{product.description}</p>
        ) : (
          <div className="flex flex-col gap-6">
            {reviews.length === 0 ? (
              <p className="text-sm text-stone">No reviews yet. Be the first to share your thoughts.</p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="border-b border-hairline pb-6 dark:border-hairline-dark">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex gap-0.5 text-gold">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={13} fill={i < review.rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{review.user?.name}</span>
                    {review.isVerifiedPurchase && (
                      <span className="text-[10px] uppercase text-emerald-600">Verified Purchase</span>
                    )}
                    <span className="ml-auto text-xs text-stone">{formatDate(review.createdAt)}</span>
                  </div>
                  {review.title && <p className="text-sm font-semibold">{review.title}</p>}
                  <p className="mt-1 text-sm text-stone">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {related.length > 0 && (
        <div className="mt-16 border-t border-hairline pt-10 dark:border-hairline-dark">
          <h2 className="mb-6 font-display text-2xl tracking-tightest">You May Also Like</h2>
          <ProductGrid products={related} isLoading={false} />
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;
