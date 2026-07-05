export const ProductCardSkeleton = () => (
  <div className="flex flex-col gap-3">
    <div className="skeleton aspect-[3/4] w-full rounded-xl2" />
    <div className="skeleton h-3.5 w-3/4 rounded-full" />
    <div className="skeleton h-3.5 w-1/3 rounded-full" />
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const ProductDetailsSkeleton = () => (
  <div className="container-page grid grid-cols-1 gap-10 py-10 lg:grid-cols-2 lg:gap-16 lg:py-16">
    <div className="skeleton aspect-square w-full rounded-2xl" />
    <div className="flex flex-col gap-4">
      <div className="skeleton h-4 w-24 rounded-full" />
      <div className="skeleton h-9 w-4/5 rounded-lg" />
      <div className="skeleton h-6 w-32 rounded-full" />
      <div className="skeleton mt-4 h-24 w-full rounded-lg" />
      <div className="skeleton h-12 w-full rounded-full" />
    </div>
  </div>
);
