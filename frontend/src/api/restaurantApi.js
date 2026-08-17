import api from "./axios.js";

export const fetchRestaurants = (params = {}) =>
  api.get("/restaurants", { params }).then((r) => r.data);

export const fetchRestaurantById = (id) =>
  api.get(`/restaurants/${id}`).then((r) => r.data);

export const fetchRestaurantMenu = (id) =>
  api.get(`/restaurants/${id}/menu`).then((r) => r.data);

export const fetchMyRestaurants = () =>
  api.get("/restaurants/mine/list").then((r) => r.data);

export const createRestaurant = (payload) =>
  api.post("/restaurants", payload).then((r) => r.data);

export const updateRestaurant = (id, payload) =>
  api.put(`/restaurants/${id}`, payload).then((r) => r.data);

export const deleteRestaurant = (id) =>
  api.delete(`/restaurants/${id}`).then((r) => r.data);

export const createMenuItem = (payload) =>
  api.post("/menu", payload).then((r) => r.data);

export const updateMenuItem = (id, payload) =>
  api.put(`/menu/${id}`, payload).then((r) => r.data);

export const deleteMenuItem = (id) =>
  api.delete(`/menu/${id}`).then((r) => r.data);
