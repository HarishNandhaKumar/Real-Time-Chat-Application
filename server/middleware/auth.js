
import jwt from "jsonwebtoken";
import User from "../models/user.js";

// Middleware to protect routes
export const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // DEBUG LOGS
    console.log("Incoming Authorization Header:", authHeader);
    const token = authHeader?.split(" ")[1];
    console.log("🧾 Extracted Token:", token);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    if (!token || token === "undefined" || token === "null") {
      return res.status(401).json({ success: false, message: "Invalid token format" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("JWT Decoded Payload:", decoded);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    res.status(401).json({ success: false, message: "Unauthorized - " + error.message });
  }
};
