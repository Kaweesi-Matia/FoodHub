import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// @desc    Update the logged-in user's profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;
  user.avatar = req.body.avatar || user.avatar;

  // Password changes go through their own dedicated flow, never silently here
  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.json({
    success: true,
    data: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
    },
  });
});

// @desc    Add a delivery address
// @route   POST /api/users/addresses
// @access  Private
const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { label, street, city, state, postalCode, country, isDefault } = req.body;

  if (!street || !city) {
    res.status(400);
    throw new Error("Street and city are required");
  }

  if (isDefault) {
    user.addresses.forEach((addr) => (addr.isDefault = false));
  }

  user.addresses.push({ label, street, city, state, postalCode, country, isDefault });
  await user.save();

  res.status(201).json({ success: true, data: user.addresses });
});

// @desc    Delete a delivery address
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses = user.addresses.filter(
    (addr) => addr._id.toString() !== req.params.addressId
  );
  await user.save();
  res.json({ success: true, data: user.addresses });
});

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json({ success: true, count: users.length, data: users });
});

// @desc    Update a user's role or active status (admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUserByAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (req.body.role) user.role = req.body.role;
  if (typeof req.body.isActive === "boolean") user.isActive = req.body.isActive;

  const updatedUser = await user.save();
  res.json({ success: true, data: updatedUser });
});

export { updateProfile, addAddress, deleteAddress, getUsers, updateUserByAdmin };
