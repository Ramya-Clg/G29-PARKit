import { SignupSchema } from "../types/index.js";
import { User } from "../db/index.js";
import { Router } from "express";
import { generateOTP, sendOTP } from "../utils/sendOtp.js";
import { storeOTP, verifyOTP } from "../utils/otpStorage.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { configDotenv } from "dotenv";
configDotenv();

const signupRouter = Router();
const SALT_ROUNDS = 10;

const pendingUsers = new Map();

signupRouter.post("/initiate", async (req, res) => {
  try {
    console.log(req.body);
    const parsedObj = SignupSchema.safeParse(req.body);
    if (!parsedObj.success) {
      return res.status(400).json({
        success: false,
        msg: "Validation failed",
        errors: parsedObj.error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }

    const userData = parsedObj.data;
    const { email, password, confirmPassword, acceptTerms } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        msg: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const userDataToStore = {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      phone: userData.phone,
    };

    const otp = generateOTP();
    const sent = await sendOTP(email, otp);
    if (!sent) {
      return res.status(500).json({
        success: false,
        msg: "Failed to send OTP",
      });
    }

    storeOTP(email, otp);
    pendingUsers.set(email, {
      ...userDataToStore,
      timestamp: Date.now(),
    });

    res.json({
      success: true,
      msg: "OTP sent successfully",
      email,
    });
  } catch (error) {
    console.error("Signup initiate error:", error);
    res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
});

signupRouter.post("/verify", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      msg: "Email and OTP are required",
    });
  }

  try {
    const isValid = verifyOTP(email, otp);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        msg: "Invalid or expired OTP",
      });
    }

    const userData = pendingUsers.get(email);
    if (!userData) {
      return res.status(400).json({
        success: false,
        msg: "No pending registration found",
      });
    }

    const newUser = new User(userData);
    await newUser.save();

    pendingUsers.delete(email);

    const token = jwt.sign(
      {
        _id: newUser._id,
        role: newUser.role,
        email: newUser.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
        msg: "Signup successful",
      },
    });
  } catch (error) {
    console.error("Signup verify error:", error);
    res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
});

setInterval(
  () => {
    const now = Date.now();
    pendingUsers.forEach((userData, email, map) => {
      if (now - userData.timestamp > 10 * 60 * 1000) {
        map.delete(email);
      }
    });
  },
  5 * 60 * 1000,
);

export default signupRouter;
