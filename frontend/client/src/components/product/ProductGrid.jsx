import ProductCard from "./ProductCard";
import { ProductGridSkeleton } from "../skeletons/Skeletons";
import { PackageSearch } from "lucide-react";

const ProductGrid = ({ products, isLoading, emptyMessage = "No products found" }) => {
  if (isLoading) return <ProductGridSkeleton />;

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <PackageSearch size={40} className="text-stone" strokeWidth={1.25} />
        <p className="text-sm text-stone">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
