import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { categoryService, brandService } from "../../services/productService";
import { adminProductService } from "../../services/adminProductService";

const ProductFormModal = ({ isOpen, onClose, onSaved, product }) => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [images, setImages] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    categoryService.getCategories().then((res) => setCategories(res.data));
    brandService.getBrands().then((res) => setBrands(res.data));
  }, []);

  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        description: product.description,
        shortDescription: product.shortDescription,
        price: product.price,
        discountPrice: product.discountPrice,
        stock: product.stock,
        category: product.category?._id,
        brand: product.brand?._id,
      });
    } else {
      reset({ title: "", description: "", shortDescription: "", price: "", discountPrice: "", stock: "" });
    }
    setImages([]);
  }, [product, isOpen]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => formData.append(key, value));
      images.forEach((file) => formData.append("images", file));

      if (product) {
        await adminProductService.updateProduct(product._id, formData);
        toast.success("Product updated successfully");
      } else {
        await adminProductService.createProduct(formData);
        toast.success("Product created successfully");
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save product");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product ? "Edit Product" : "Add New Product"} size="xl">
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Title"
          className="sm:col-span-2"
          {...register("title", { required: "Title is required" })}
          error={errors.title?.message}
        />

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-stone">
            Description
          </label>
          <textarea
            rows={4}
            className="input-field"
            {...register("description", { required: "Description is required" })}
          />
          {errors.description && <p className="mt-1.5 text-xs text-red-500">{errors.description.message}</p>}
        </div>

        <Input label="Short Description" className="sm:col-span-2" {...register("shortDescription")} />

        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-stone">
            Category
          </label>
          <select className="input-field" {...register("category", { required: "Required" })}>
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-stone">Brand</label>
          <select className="input-field" {...register("brand", { required: "Required" })}>
            <option value="">Select brand</option>
            {brands.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Price"
          type="number"
          step="0.01"
          {...register("price", { required: "Required", min: 0 })}
          error={errors.price?.message}
        />
        <Input label="Discount Price (optional)" type="number" step="0.01" {...register("discountPrice")} />
        <Input
          label="Stock"
          type="number"
          {...register("stock", { required: "Required", min: 0 })}
          error={errors.stock?.message}
        />

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-stone">
            Product Images
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages(Array.from(e.target.files))}
            className="block w-full text-sm text-stone file:mr-4 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-xs file:font-medium file:text-ivory dark:file:bg-cream dark:file:text-ink"
          />
        </div>

        <div className="sm:col-span-2">
          <Button type="submit" isLoading={isSubmitting} className="w-full">
            {product ? "Save Changes" : "Create Product"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductFormModal;
