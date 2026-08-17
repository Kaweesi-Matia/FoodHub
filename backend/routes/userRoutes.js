import express from "express";
import {
  updateProfile,
  addAddress,
  deleteAddress,
  getUsers,
  updateUserByAdmin,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/profile", protect, updateProfile);
router.post("/addresses", protect, addAddress);
router.delete("/addresses/:addressId", protect, deleteAddress);

router.get("/", protect, admin, getUsers);
router.put("/:id", protect, admin, updateUserByAdmin);

export default router;
