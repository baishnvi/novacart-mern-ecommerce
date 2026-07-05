import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { productService } from "../../services/productService";
import { adminProductService } from "../../services/adminProductService";
import { formatCurrency } from "../../utils/formatters";
import Button from "../../components/ui/Button";
import ProductFormModal from "../../components/admin/ProductFormModal";

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const res = await productService.getProducts({ limit: 50 });
      setProducts(res.data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product? This action cannot be undone.")) return;
    try {
      await adminProductService.deleteProduct(id);
      toast.success("Product deleted");
      loadProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete product");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="eyebrow">Catalog</span>
          <h1 className="mt-1 font-display text-3xl tracking-tightest">Products</h1>
        </div>
        <Button icon={Plus} onClick={handleAdd}>
          Add Product
        </Button>
      </div>

      <div className="card-surface overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-b border-hairline text-xs uppercase tracking-wide text-stone dark:border-hairline-dark">
              <th className="px-5 py-4">Product</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4">Stock</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-stone">
                  Loading products...
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="border-b border-hairline last:border-0 dark:border-hairline-dark">
                  <td className="flex items-center gap-3 px-5 py-4">
                    <img
                      src={product.images?.[0]?.url}
                      alt={product.title}
                      className="h-12 w-10 rounded-md object-cover"
                    />
                    <span className="font-medium">{product.title}</span>
                  </td>
                  <td className="px-5 py-4 text-stone">{product.category?.name}</td>
                  <td className="px-5 py-4 tabular-nums">{formatCurrency(product.price)}</td>
                  <td className="px-5 py-4 tabular-nums">{product.stock}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleEdit(product)} className="text-stone hover:text-ink dark:hover:text-cream">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(product._id)} className="text-stone hover:text-red-500">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={loadProducts}
        product={editingProduct}
      />
    </div>
  );
};

export default AdminProductsPage;
