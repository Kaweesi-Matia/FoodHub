import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";
import Restaurant from "../models/Restaurant.js";

const TAX_RATE = 0.05; // 5% — kept simple and transparent for a portfolio project

// @desc    Create a new order from a cart payload
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { restaurantId, items, deliveryAddress, paymentMethod } = req.body;

  if (!restaurantId || !items || items.length === 0) {
    res.status(400);
    throw new Error("An order needs a restaurant and at least one item");
  }

  if (!deliveryAddress?.street || !deliveryAddress?.city) {
    res.status(400);
    throw new Error("A delivery address is required");
  }

  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    res.status(404);
    throw new Error("Restaurant not found");
  }
  if (!restaurant.isOpen) {
    res.status(400);
    throw new Error("This restaurant is currently closed");
  }

  // Re-derive prices from the database — never trust client-submitted prices
  const menuItemIds = items.map((i) => i.menuItem);
  const dbMenuItems = await MenuItem.find({ _id: { $in: menuItemIds } });

  const orderItems = items.map((item) => {
    const dbItem = dbMenuItems.find((m) => m._id.toString() === item.menuItem);
    if (!dbItem || !dbItem.isAvailable) {
      res.status(400);
      throw new Error(`Item "${item.name || item.menuItem}" is unavailable`);
    }
    return {
      menuItem: dbItem._id,
      name: dbItem.name,
      price: dbItem.price,
      quantity: item.quantity,
      image: dbItem.image,
    };
  });

  const itemsPrice = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (itemsPrice < restaurant.minOrderAmount) {
    res.status(400);
    throw new Error(
      `Minimum order amount for this restaurant is ${restaurant.minOrderAmount}`
    );
  }

  const deliveryFee = restaurant.deliveryFee;
  const taxPrice = Number((itemsPrice * TAX_RATE).toFixed(2));
  const totalPrice = Number((itemsPrice + deliveryFee + taxPrice).toFixed(2));

  const order = await Order.create({
    user: req.user._id,
    restaurant: restaurant._id,
    items: orderItems,
    deliveryAddress,
    paymentMethod,
    itemsPrice,
    deliveryFee,
    taxPrice,
    totalPrice,
    status: "pending",
  });

  res.status(201).json({ success: true, data: order });
});

// @desc    Get logged-in user's orders
// @route   GET /api/orders/mine
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("restaurant", "name coverImage")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: orders.length, data: orders });
});

// @desc    Get a single order by id
// @route   GET /api/orders/:id
// @access  Private (owner, restaurant owner, or admin)
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email phone")
    .populate("restaurant", "name owner coverImage");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const isCustomer = order.user._id.toString() === req.user._id.toString();
  const isRestaurantOwner = order.restaurant.owner.toString() === req.user._id.toString();

  if (!isCustomer && !isRestaurantOwner && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to view this order");
  }

  res.json({ success: true, data: order });
});

// @desc    Get orders for a restaurant owned by the logged-in user
// @route   GET /api/orders/restaurant/:restaurantId
// @access  Private/RestaurantOwner
const getRestaurantOrders = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.restaurantId);

  if (!restaurant) {
    res.status(404);
    throw new Error("Restaurant not found");
  }

  const isOwner = restaurant.owner.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to view these orders");
  }

  const orders = await Order.find({ restaurant: req.params.restaurantId })
    .populate("user", "name phone")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: orders.length, data: orders });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/RestaurantOwner or Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = [
    "pending",
    "confirmed",
    "preparing",
    "outForDelivery",
    "delivered",
    "cancelled",
  ];

  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid order status");
  }

  const order = await Order.findById(req.params.id).populate("restaurant", "owner");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const isOwner = order.restaurant.owner.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to update this order");
  }

  order.status = status;
  if (status === "delivered") {
    order.deliveredAt = new Date();
    order.isPaid = order.paymentMethod === "cash" ? true : order.isPaid;
  }

  const updated = await order.save();
  res.json({ success: true, data: updated });
});

// @desc    Cancel an order (customer, only while pending)
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to cancel this order");
  }

  if (!["pending", "confirmed"].includes(order.status)) {
    res.status(400);
    throw new Error("This order can no longer be cancelled");
  }

  order.status = "cancelled";
  const updated = await order.save();

  res.json({ success: true, data: updated });
});

export {
  createOrder,
  getMyOrders,
  getOrderById,
  getRestaurantOrders,
  updateOrderStatus,
  cancelOrder,
};
