import asyncHandler from "express-async-handler";
import Restaurant from "../models/Restaurant.js";
import MenuItem from "../models/MenuItem.js";

// @desc    Get all restaurants (with search, cuisine filter, and pagination)
// @route   GET /api/restaurants
// @access  Public
const getRestaurants = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 12;
  const page = Number(req.query.page) || 1;

  const query = { isApproved: true };

  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }

  if (req.query.cuisine) {
    query.cuisine = { $in: [req.query.cuisine] };
  }

  if (req.query.city) {
    query["address.city"] = new RegExp(req.query.city, "i");
  }

  const count = await Restaurant.countDocuments(query);
  const restaurants = await Restaurant.find(query)
    .sort(req.query.sort === "rating" ? { rating: -1 } : { createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    success: true,
    data: restaurants,
    page,
    pages: Math.ceil(count / pageSize),
    count,
  });
});

// @desc    Get single restaurant by id
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurantById = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id).populate(
    "owner",
    "name email"
  );

  if (!restaurant) {
    res.status(404);
    throw new Error("Restaurant not found");
  }

  res.json({ success: true, data: restaurant });
});

// @desc    Get menu items belonging to a restaurant
// @route   GET /api/restaurants/:id/menu
// @access  Public
const getRestaurantMenu = asyncHandler(async (req, res) => {
  const menuItems = await MenuItem.find({
    restaurant: req.params.id,
    isAvailable: true,
  }).sort({ category: 1 });

  res.json({ success: true, count: menuItems.length, data: menuItems });
});

// @desc    Create a restaurant
// @route   POST /api/restaurants
// @access  Private/RestaurantOwner
const createRestaurant = asyncHandler(async (req, res) => {
  const { name, description, cuisine, address, contact, priceRange, deliveryFee } =
    req.body;

  if (!name || !description || !address?.street || !address?.city) {
    res.status(400);
    throw new Error("Name, description, and address are required");
  }

  const restaurant = await Restaurant.create({
    owner: req.user._id,
    name,
    description,
    cuisine,
    address,
    contact,
    priceRange,
    deliveryFee,
    // New restaurants require admin approval before appearing publicly
    isApproved: req.user.role === "admin",
  });

  res.status(201).json({ success: true, data: restaurant });
});

// @desc    Update a restaurant
// @route   PUT /api/restaurants/:id
// @access  Private/RestaurantOwner (own restaurant) or Admin
const updateRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    res.status(404);
    throw new Error("Restaurant not found");
  }

  const isOwner = restaurant.owner.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to update this restaurant");
  }

  const updatableFields = [
    "name",
    "description",
    "cuisine",
    "coverImage",
    "logo",
    "address",
    "contact",
    "priceRange",
    "deliveryFee",
    "minOrderAmount",
    "estimatedDeliveryTime",
    "openingHours",
    "isOpen",
  ];

  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) restaurant[field] = req.body[field];
  });

  // Only an admin can (re)approve or feature a restaurant
  if (req.user.role === "admin") {
    if (req.body.isApproved !== undefined) restaurant.isApproved = req.body.isApproved;
    if (req.body.isFeatured !== undefined) restaurant.isFeatured = req.body.isFeatured;
  }

  const updated = await restaurant.save();
  res.json({ success: true, data: updated });
});

// @desc    Delete a restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private/RestaurantOwner (own restaurant) or Admin
const deleteRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    res.status(404);
    throw new Error("Restaurant not found");
  }

  const isOwner = restaurant.owner.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to delete this restaurant");
  }

  await MenuItem.deleteMany({ restaurant: restaurant._id });
  await restaurant.deleteOne();

  res.json({ success: true, message: "Restaurant removed" });
});

// @desc    Get restaurants owned by the logged-in user
// @route   GET /api/restaurants/mine/list
// @access  Private/RestaurantOwner
const getMyRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find({ owner: req.user._id });
  res.json({ success: true, count: restaurants.length, data: restaurants });
});

export {
  getRestaurants,
  getRestaurantById,
  getRestaurantMenu,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getMyRestaurants,
};
