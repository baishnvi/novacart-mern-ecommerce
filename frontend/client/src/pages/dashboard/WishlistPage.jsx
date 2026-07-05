import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchWishlist } from "../../features/wishlist/wishlistSlice";
import ProductGrid from "../../components/product/ProductGrid";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { products, status } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  if (status === "succeeded" && products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <Heart size={36} className="text-stone" strokeWidth={1.25} />
        <p className="text-sm text-stone">Your wishlist is empty.</p>
        <Link to="/shop" className="btn-secondary">
          Discover Products
        </Link>
      </div>
    );
  }

  return <ProductGrid products={products} isLoading={status === "loading"} />;
};

export default WishlistPage;
