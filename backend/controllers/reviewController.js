import asyncHandler from "express-async-handler";
import Review from "../models/Review.js";
import Order from "../models/Order.js";

// @desc    Create a review for a delivered order
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { orderId, rating, comment } = req.body;

  if (!orderId || !rating) {
    res.status(400);
    throw new Error("orderId and rating are required");
  }

  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to review this order");
  }

  if (order.status !== "delivered") {
    res.status(400);
    throw new Error("You can only review orders that have been delivered");
  }

  const alreadyReviewed = await Review.findOne({ order: orderId, user: req.user._id });
  if (alreadyReviewed) {
    res.status(400);
    throw new Error("You have already reviewed this order");
  }

  const review = await Review.create({
    user: req.user._id,
    restaurant: order.restaurant,
    order: orderId,
    rating,
    comment,
  });

  res.status(201).json({ success: true, data: review });
});

// @desc    Get all reviews for a restaurant
// @route   GET /api/reviews/restaurant/:restaurantId
// @access  Public
const getRestaurantReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ restaurant: req.params.restaurantId })
    .populate("user", "name avatar")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: reviews.length, data: reviews });
});

// @desc    Delete a review (author or admin)
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to delete this review");
  }

  await Review.findOneAndDelete({ _id: review._id });
  res.json({ success: true, message: "Review removed" });
});

export { createReview, getRestaurantReviews, deleteReview };
