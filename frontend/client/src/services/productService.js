import api from "./api";

export const productService = {
  getProducts: (params) => api.get("/products", { params }).then((res) => res.data),
  getProductBySlug: (slug) => api.get(`/products/${slug}`).then((res) => res.data),
  getCollection: (type, limit = 12) =>
    api.get(`/products/collections/${type}`, { params: { limit } }).then((res) => res.data),
};

export const categoryService = {
  getCategories: () => api.get("/categories").then((res) => res.data),
};

export const brandService = {
  getBrands: () => api.get("/brands").then((res) => res.data),
};

export const reviewService = {
  getProductReviews: (productId, params) =>
    api.get(`/reviews/product/${productId}`, { params }).then((res) => res.data),
  createReview: (formData) =>
    api
      .post("/reviews", formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((res) => res.data),
  markHelpful: (id) => api.put(`/reviews/${id}/helpful`).then((res) => res.data),
};
