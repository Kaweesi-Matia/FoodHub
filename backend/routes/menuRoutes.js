import express from "express";
import {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItemById,
} from "../controllers/menuController.js";
import { protect, restaurantOwner } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:id", getMenuItemById);
router.post("/", protect, restaurantOwner, createMenuItem);
router.put("/:id", protect, restaurantOwner, updateMenuItem);
router.delete("/:id", protect, restaurantOwner, deleteMenuItem);

export default router;
