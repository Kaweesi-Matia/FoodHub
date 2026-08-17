import express from "express";
import {
  getRestaurants,
  getRestaurantById,
  getRestaurantMenu,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getMyRestaurants,
} from "../controllers/restaurantController.js";
import { protect, restaurantOwner } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getRestaurants);
router.get("/mine/list", protect, restaurantOwner, getMyRestaurants);
router.get("/:id", getRestaurantById);
router.get("/:id/menu", getRestaurantMenu);

router.post("/", protect, restaurantOwner, createRestaurant);
router.put("/:id", protect, restaurantOwner, updateRestaurant);
router.delete("/:id", protect, restaurantOwner, deleteRestaurant);

export default router;
