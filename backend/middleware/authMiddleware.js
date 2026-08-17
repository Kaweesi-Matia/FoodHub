import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// Protects routes — requires a valid JWT (cookie or Bearer header)
const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.token;

  if (!token && req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) {
      res.status(401);
      throw new Error("Not authorized, user no longer exists");
    }

    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, token invalid or expired");
  }
});

// Restricts a route to admin users only. Must run after `protect`.
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }
};

// Restricts a route to restaurant owners (or admins). Must run after `protect`.
const restaurantOwner = (req, res, next) => {
  if (req.user && (req.user.role === "restaurantOwner" || req.user.role === "admin")) {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as a restaurant owner");
  }
};

export { protect, admin, restaurantOwner };
