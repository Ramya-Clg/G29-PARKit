import { User } from "../db/index.js";
import { LoginSchema, ResetPasswordSchema } from "../types/index.js";
import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { generateOTP, sendOTP } from "../utils/sendOtp.js";
import { storeOTP, verifyOTP } from "../utils/otpStorage.js";

const loginRouter = Router();
const SALT_ROUNDS = 10;

loginRouter.post("/", async (req, res) => {
  const parsedObj = LoginSchema.safeParse(req.body);
  if (!parsedObj.success) {
    return res.status(400).json({
      success: false,
      msg: "Invalid email or password format",
    });
  }

  const { email, password } = parsedObj.data;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "Invalid email or password",
      });
    }

    // Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        msg: "Invalid email or password",
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
      msg: "Something went wrong. Please try again later.",
    });
  }
});

// Step 1: Initiate forgot password
loginRouter.post("/forgot-password/initiate", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "No account found with this email",
      });
    }

    // Generate and send OTP
    const otp = generateOTP();
    const sent = await sendOTP(email, otp);
    if (!sent) {
      return res.status(500).json({
        success: false,
        msg: "Failed to send verification code",
      });
    }

    // Store OTP
    storeOTP(email, otp);

    res.json({
      success: true,
      msg: "Password reset code sent to your email",
      email,
    });
  } catch (error) {
    console.error("Forgot password initiate error:", error);
    res.status(500).json({
      success: false,
      msg: "Failed to process request",
    });
  }
});

// Step 2: Verify OTP and reset password
loginRouter.post("/forgot-password/reset", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Validate password requirements
    const parsedObj = ResetPasswordSchema.safeParse({
      password: newPassword,
      confirmPassword: req.body.confirmPassword,
    });

    if (!parsedObj.success) {
      return res.status(400).json({
        success: false,
        msg: "Password validation failed",
        errors: parsedObj.error.errors,
      });
    }

    // Verify OTP
    const isValid = verifyOTP(email, otp);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        msg: "Invalid or expired verification code",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // Update user's password
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    res.json({
      success: true,
      msg: "Password reset successful",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({
      success: false,
      msg: "Failed to reset password",
    });
  }
});

// Add this new endpoint to verify OTP before password reset
loginRouter.post("/forgot-password/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        msg: "Email and verification code are required",
      });
    }

    // Verify OTP
    const isValid = verifyOTP(email, otp);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        msg: "Invalid or expired verification code",
      });
    }

    // If OTP is valid, store it again for the password reset step
    storeOTP(email, otp);

    res.json({
      success: true,
      msg: "Verification code confirmed",
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({
      success: false,
      msg: "Failed to verify code",
    });
  }
});

export default loginRouter;
