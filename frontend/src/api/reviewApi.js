import api from "./axios.js";

export const createReview = (payload) => api.post("/reviews", payload).then((r) => r.data);
export const fetchRestaurantReviews = (restaurantId) =>
  api.get(`/reviews/restaurant/${restaurantId}`).then((r) => r.data);
export const deleteReview = (id) => api.delete(`/reviews/${id}`).then((r) => r.data);
