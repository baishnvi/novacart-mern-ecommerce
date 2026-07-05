import api from "./api";

export const cartService = {
  getCart: () => api.get("/cart").then((res) => res.data),
  addItem: (payload) => api.post("/cart/items", payload).then((res) => res.data),
  updateItem: (itemId, quantity) =>
    api.put(`/cart/items/${itemId}`, { quantity }).then((res) => res.data),
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}`).then((res) => res.data),
  clearCart: () => api.delete("/cart").then((res) => res.data),
  applyCoupon: (code) => api.post("/cart/coupon", { code }).then((res) => res.data),
  removeCoupon: () => api.delete("/cart/coupon").then((res) => res.data),
};

export const wishlistService = {
  getWishlist: () => api.get("/wishlist").then((res) => res.data),
  addToWishlist: (productId) => api.post("/wishlist", { productId }).then((res) => res.data),
  removeFromWishlist: (productId) => api.delete(`/wishlist/${productId}`).then((res) => res.data),
};

export const orderService = {
  createPaymentIntent: () => api.post("/orders/create-payment-intent").then((res) => res.data),
  createOrder: (payload) => api.post("/orders", payload).then((res) => res.data),
  getMyOrders: (params) => api.get("/orders/my-orders", { params }).then((res) => res.data),
  getOrderById: (id) => api.get(`/orders/${id}`).then((res) => res.data),
  cancelOrder: (id, reason) => api.put(`/orders/${id}/cancel`, { reason }).then((res) => res.data),
  getAllOrders: (params) => api.get("/orders", { params }).then((res) => res.data),
  updateOrderStatus: (id, payload) => api.put(`/orders/${id}/status`, payload).then((res) => res.data),
};

export const addressService = {
  getAddresses: () => api.get("/addresses").then((res) => res.data),
  createAddress: (payload) => api.post("/addresses", payload).then((res) => res.data),
  updateAddress: (id, payload) => api.put(`/addresses/${id}`, payload).then((res) => res.data),
  deleteAddress: (id) => api.delete(`/addresses/${id}`).then((res) => res.data),
};

export const userService = {
  updateProfile: (formData) =>
    api
      .put("/users/profile", formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((res) => res.data),
  changePassword: (payload) => api.put("/users/change-password", payload).then((res) => res.data),
  getUsers: (params) => api.get("/users", { params }).then((res) => res.data),
  updateUser: (id, payload) => api.put(`/users/${id}`, payload).then((res) => res.data),
  deleteUser: (id) => api.delete(`/users/${id}`).then((res) => res.data),
};

export const notificationService = {
  getNotifications: (params) => api.get("/notifications", { params }).then((res) => res.data),
  markAsRead: (id) => api.put(`/notifications/${id}/read`).then((res) => res.data),
  markAllAsRead: () => api.put("/notifications/read-all").then((res) => res.data),
};

export const adminService = {
  getDashboardStats: () => api.get("/admin/stats").then((res) => res.data),
};
