import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

// One review per user per order
reviewSchema.index({ user: 1, order: 1 }, { unique: true });

// Recalculate the parent restaurant's aggregate rating after any change
reviewSchema.statics.recalculateRestaurantRating = async function (restaurantId) {
  const Restaurant = mongoose.model("Restaurant");
  const stats = await this.aggregate([
    { $match: { restaurant: restaurantId } },
    {
      $group: {
        _id: "$restaurant",
        avgRating: { $avg: "$rating" },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  await Restaurant.findByIdAndUpdate(restaurantId, {
    rating: stats[0]?.avgRating?.toFixed(1) || 0,
    numReviews: stats[0]?.numReviews || 0,
  });
};

reviewSchema.post("save", function () {
  this.constructor.recalculateRestaurantRating(this.restaurant);
});

reviewSchema.post("findOneAndDelete", function (doc) {
  if (doc) doc.constructor.recalculateRestaurantRating(doc.restaurant);
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
