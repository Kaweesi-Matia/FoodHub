import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Restaurant name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    cuisine: [{ type: String, trim: true }],
    coverImage: {
      type: String,
      default: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    },
    logo: {
      type: String,
      default: "",
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    contact: {
      phone: { type: String },
      email: { type: String },
    },
    priceRange: {
      type: String,
      enum: ["$", "$$", "$$$", "$$$$"],
      default: "$$",
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    deliveryFee: {
      type: Number,
      default: 2.5,
      min: 0,
    },
    minOrderAmount: {
      type: Number,
      default: 0,
    },
    estimatedDeliveryTime: {
      type: String,
      default: "30-40 min",
    },
    openingHours: {
      open: { type: String, default: "09:00" },
      close: { type: String, default: "22:00" },
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

restaurantSchema.index({ name: "text", cuisine: "text" });

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
export default Restaurant;
