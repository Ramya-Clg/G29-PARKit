import jwt from "jsonwebtoken";
import { ZodError } from "zod";
import { configDotenv } from "dotenv";
import { User } from "../db/index.js";
configDotenv();

const authorizationMiddleware = async (req, res, next) => {
  const response = req.headers["authorization"];
  const token = response?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ msg: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    req.email = decoded.email;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ msg: "Unauthorized" });
  }
};

export { authorizationMiddleware };
