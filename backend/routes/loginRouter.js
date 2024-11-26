import { User } from "../db/index.js";
import { LoginSchema } from "../types/index.js";
import { Router } from "express";
import jwt from "jsonwebtoken";

const loginRouter = Router();

loginRouter.post("/", async (req, res) => {
  const parsedObj = LoginSchema.safeParse(req.body);
  if (!parsedObj.success) {
    return res.status(400).json({
      success: false,
      msg: "Invalid Format",
    });
  }

  const { email, password } = parsedObj.data;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "Invalid credentials",
      });
    }

    if (user.password !== password) {
      return res.status(400).json({
        success: false,
        msg: "Invalid credentials",
      });
    }

    const tokenPayload = {
      _id: user._id,
      role: user.role,
      email: user.email,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      msg: "Internal Server Error",
    });
  }
});

export default loginRouter;
