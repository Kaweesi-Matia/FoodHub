import api from "./axios.js";

export const createOrder = (payload) => api.post("/orders", payload).then((r) => r.data);
export const fetchMyOrders = () => api.get("/orders/mine").then((r) => r.data);
export const fetchOrderById = (id) => api.get(`/orders/${id}`).then((r) => r.data);
export const fetchRestaurantOrders = (restaurantId) =>
  api.get(`/orders/restaurant/${restaurantId}`).then((r) => r.data);
export const updateOrderStatus = (id, status) =>
  api.put(`/orders/${id}/status`, { status }).then((r) => r.data);
export const cancelOrder = (id) => api.put(`/orders/${id}/cancel`).then((r) => r.data);
