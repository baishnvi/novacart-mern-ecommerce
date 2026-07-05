import api from "./api";

export const adminProductService = {
  createProduct: (formData) =>
    api
      .post("/products", formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((res) => res.data),
  updateProduct: (id, formData) =>
    api
      .put(`/products/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((res) => res.data),
  deleteProduct: (id) => api.delete(`/products/${id}`).then((res) => res.data),
};
