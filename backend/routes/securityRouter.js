import { Router } from "express";
import { Security } from "../db/index.js";
import { authorizationMiddleware } from "../middlewares/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const securityRouter = Router();

securityRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const security = await Security.findOne({ email });
    if (!security) {
      return res.status(401).json({
        success: false,
        msg: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, security.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        msg: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { _id: security._id, role: security.role },
      process.env.JWT_SECRET,
      { expiresIn: "1hr" },
    );

    res.json({
      success: true,
      msg: "Login successful",
      data: {
        token,
        security: {
          name: security.name,
          email: security.email,
          role: security.role,
        },
      },
    });
  } catch (error) {
    console.error("Security login error:", error);
    res.status(500).json({
      success: false,
      msg: "Login failed",
      error: error.message,
    });
  }
});

export default securityRouter;
