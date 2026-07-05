import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import ProductGrid from "../components/product/ProductGrid";
import FilterSidebar from "../components/product/FilterSidebar";
import { productService } from "../services/productService";

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Most Popular", value: "popular" },
  { label: "Top Rated", value: "rating-desc" },
];

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filters = Object.fromEntries(searchParams.entries());
  const page = Number(filters.page) || 1;

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await productService.getProducts({ ...filters, limit: 12 });
      setProducts(res.data);
      setMeta(res.meta);
    } catch (err) {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [fetchProducts]);

  const updateFilters = (updates) => {
    const next = { ...filters, ...updates, page: 1 };
    Object.keys(next).forEach((key) => {
      if (next[key] === undefined || next[key] === "") delete next[key];
    });
    setSearchParams(next);
  };

  const clearFilters = () => setSearchParams({});

  const goToPage = (p) => {
    updateFilters({ page: p });
  };

  return (
    <div className="container-page py-10 lg:py-14">
      <div className="mb-8 flex flex-col gap-2">
        <span className="eyebrow">{meta.total} Results</span>
        <h1 className="font-display text-4xl tracking-tightest">
          {filters.search ? `Results for "${filters.search}"` : "Shop All"}
        </h1>
      </div>

      <div className="mb-6 flex items-center justify-between gap-4 border-b border-hairline pb-6 dark:border-hairline-dark">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="btn-secondary !py-2.5 !px-5 lg:hidden"
        >
          <SlidersHorizontal size={15} /> Filters
        </button>
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden text-xs text-stone sm:inline">Sort by</span>
          <select
            value={filters.sort || "newest"}
            onChange={(e) => updateFilters({ sort: e.target.value })}
            className="rounded-full border border-ink/12 bg-transparent px-4 py-2.5 text-sm outline-none dark:border-cream/15"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
        <div className="hidden lg:block">
          <FilterSidebar filters={filters} onChange={updateFilters} onClear={clearFilters} />
        </div>

        {isFilterOpen && (
          <div className="fixed inset-0 z-[95] lg:hidden">
            <div className="absolute inset-0 bg-ink/40" onClick={() => setIsFilterOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-full max-w-xs overflow-y-auto bg-ivory p-6 dark:bg-charcoal">
              <button
                onClick={() => setIsFilterOpen(false)}
                className="mb-6 ml-auto flex rounded-full p-2 hover:bg-ink/5"
              >
                <X size={18} />
              </button>
              <FilterSidebar filters={filters} onChange={updateFilters} onClear={clearFilters} />
            </div>
          </div>
        )}

        <div>
          <ProductGrid products={products} isLoading={isLoading} emptyMessage="No products match your filters" />

          {meta.totalPages > 1 && (
            <div className="mt-14 flex items-center justify-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => goToPage(page - 1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 disabled:opacity-30 dark:border-cream/15"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: meta.totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i + 1)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm transition-colors ${
                    page === i + 1
                      ? "bg-ink text-ivory dark:bg-cream dark:text-ink"
                      : "border border-ink/10 hover:bg-ink/5 dark:border-cream/15"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={page >= meta.totalPages}
                onClick={() => goToPage(page + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 disabled:opacity-30 dark:border-cream/15"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
