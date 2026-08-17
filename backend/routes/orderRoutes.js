import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getRestaurantOrders,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/orderController.js";
import { protect, restaurantOwner } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/mine", protect, getMyOrders);
router.get("/restaurant/:restaurantId", protect, restaurantOwner, getRestaurantOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, restaurantOwner, updateOrderStatus);
router.put("/:id/cancel", protect, cancelOrder);

export default router;
