import asyncHandler from "express-async-handler";
import MenuItem from "../models/MenuItem.js";
import Restaurant from "../models/Restaurant.js";

// Shared helper — verifies the requester owns the restaurant (or is admin)
const assertOwnership = async (restaurantId, user) => {
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    const err = new Error("Restaurant not found");
    err.statusCode = 404;
    throw err;
  }
  const isOwner = restaurant.owner.toString() === user._id.toString();
  if (!isOwner && user.role !== "admin") {
    const err = new Error("Not authorized to manage this restaurant's menu");
    err.statusCode = 403;
    throw err;
  }
  return restaurant;
};

// @desc    Create a menu item
// @route   POST /api/menu
// @access  Private/RestaurantOwner
const createMenuItem = asyncHandler(async (req, res) => {
  const { restaurant, name, price, category } = req.body;

  if (!restaurant || !name || price === undefined || !category) {
    res.status(400);
    throw new Error("restaurant, name, price, and category are required");
  }

  await assertOwnership(restaurant, req.user);

  const menuItem = await MenuItem.create(req.body);
  res.status(201).json({ success: true, data: menuItem });
});

// @desc    Update a menu item
// @route   PUT /api/menu/:id
// @access  Private/RestaurantOwner
const updateMenuItem = asyncHandler(async (req, res) => {
  const menuItem = await MenuItem.findById(req.params.id);

  if (!menuItem) {
    res.status(404);
    throw new Error("Menu item not found");
  }

  await assertOwnership(menuItem.restaurant, req.user);

  Object.assign(menuItem, req.body);
  const updated = await menuItem.save();

  res.json({ success: true, data: updated });
});

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
// @access  Private/RestaurantOwner
const deleteMenuItem = asyncHandler(async (req, res) => {
  const menuItem = await MenuItem.findById(req.params.id);

  if (!menuItem) {
    res.status(404);
    throw new Error("Menu item not found");
  }

  await assertOwnership(menuItem.restaurant, req.user);

  await menuItem.deleteOne();
  res.json({ success: true, message: "Menu item removed" });
});

// @desc    Get a single menu item
// @route   GET /api/menu/:id
// @access  Public
const getMenuItemById = asyncHandler(async (req, res) => {
  const menuItem = await MenuItem.findById(req.params.id).populate(
    "restaurant",
    "name deliveryFee estimatedDeliveryTime"
  );

  if (!menuItem) {
    res.status(404);
    throw new Error("Menu item not found");
  }

  res.json({ success: true, data: menuItem });
});

export { createMenuItem, updateMenuItem, deleteMenuItem, getMenuItemById };
