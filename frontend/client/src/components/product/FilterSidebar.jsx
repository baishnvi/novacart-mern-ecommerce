import { useState, useEffect } from "react";
import { categoryService, brandService } from "../../services/productService";

const ratingOptions = [4, 3, 2, 1];

const FilterSidebar = ({ filters, onChange, onClear }) => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice || "",
    max: filters.maxPrice || "",
  });

  useEffect(() => {
    categoryService.getCategories().then((res) => setCategories(res.data));
    brandService.getBrands().then((res) => setBrands(res.data));
  }, []);

  const applyPriceRange = () => {
    onChange({ minPrice: priceRange.min || undefined, maxPrice: priceRange.max || undefined });
  };

  return (
    <aside className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg">Filters</h3>
        <button onClick={onClear} className="text-xs text-stone underline-offset-2 hover:underline">
          Clear All
        </button>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone">Category</h4>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <label key={cat._id} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input
                type="radio"
                name="category"
                checked={filters.category === cat._id}
                onChange={() => onChange({ category: cat._id })}
                className="accent-gold"
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone">Brand</h4>
        <div className="flex flex-col gap-2">
          {brands.map((brand) => (
            <label key={brand._id} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input
                type="radio"
                name="brand"
                checked={filters.brand === brand._id}
                onChange={() => onChange({ brand: brand._id })}
                className="accent-gold"
              />
              {brand.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone">Price Range</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => setPriceRange((p) => ({ ...p, min: e.target.value }))}
            onBlur={applyPriceRange}
            className="input-field !py-2 text-sm"
          />
          <span className="text-stone">–</span>
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => setPriceRange((p) => ({ ...p, max: e.target.value }))}
            onBlur={applyPriceRange}
            className="input-field !py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone">Minimum Rating</h4>
        <div className="flex flex-col gap-2">
          {ratingOptions.map((r) => (
            <label key={r} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input
                type="radio"
                name="rating"
                checked={String(filters.minRating) === String(r)}
                onChange={() => onChange({ minRating: r })}
                className="accent-gold"
              />
              {r}+ Stars
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
