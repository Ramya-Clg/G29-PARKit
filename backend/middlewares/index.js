import jwt from "jsonwebtoken";
import { User } from "../db/index.js";

export const authorizationMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("Auth header received:", authHeader);

    if (!authHeader?.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ msg: "Authorization header must start with Bearer" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token extracted:", token);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);

      const user = await User.findOne({ email: decoded.email });
      console.log("Found user:", user);

      if (!user) {
        console.log("User not found for email:", decoded.email);
        return res.status(401).json({ msg: "User not found" });
      }

      req.user = user;
      req.email = decoded.email;
      next();
    } catch (err) {
      console.error("Token verification error:", err);
      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ msg: "Invalid token" });
      }
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ msg: "Token expired" });
      }
      throw err;
    }
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).json({ msg: "Server Error" });
  }
};
