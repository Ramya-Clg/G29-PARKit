import { SignupSchema } from "../types/index.js";
import { User } from "../db/index.js";
import { Router } from "express";
import { generateOTP, sendOTP } from "../utils/sendOtp.js";
import { storeOTP, verifyOTP } from "../utils/otpStorage.js";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
configDotenv();

const signupRouter = Router();

// Temporary storage for pending users
const pendingUsers = new Map();

// Step 1: Initial signup request
signupRouter.post("/initiate", async (req, res) => {
  const parsedObj = SignupSchema.safeParse(req.body);
  if (!parsedObj.success) {
    return res.status(400).json({ msg: "Invalid Format" });
  }

  const userData = parsedObj.data;
  const { email } = userData;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User Already Exists" });
    }

    // Generate and send OTP
    const otp = generateOTP();
    console.log('Generated OTP:', otp); // Debug log

    const sent = await sendOTP(email, otp);
    console.log('OTP send status:', sent); // Debug log
    
    if (!sent) {
      return res.status(500).json({ msg: "Failed to send OTP" });
    }

    // Store OTP and user data
    storeOTP(email, otp);
    pendingUsers.set(email, userData);

    res.json({ 
      msg: "OTP sent successfully",
      email: email 
    });

  } catch (error) {
    console.error('Signup initiate error:', error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

// Step 2: Verify OTP and complete signup
signupRouter.post("/verify", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ msg: "Email and OTP are required" });
  }

  try {
    // Verify OTP
    const isValid = verifyOTP(email, otp);
    console.log('OTP verification result:', isValid); // Debug log

    if (!isValid) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    // Get pending user data
    const userData = pendingUsers.get(email);
    console.log('Retrieved user data:', userData); // Debug log

    if (!userData) {
      return res.status(400).json({ msg: "No pending registration found" });
    }

    // Create user
    const newUser = new User(userData);
    await newUser.save();

    // Clear temporary data
    pendingUsers.delete(email);

    // Generate JWT token
    const token = jwt.sign(
      { 
        _id: newUser._id,
        role: newUser.role,
        email: newUser.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ 
      success: true,
      data: {
        token,
        msg: "Signup successful"
      }
    });

  } catch (error) {
    console.error('Signup verify error:', error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

// Optional: Cleanup old pending users periodically
setInterval(() => {
  const now = Date.now();
  for (const [email, timestamp] of pendingUsers.entries()) {
    if (now - timestamp > 10 * 60 * 1000) { // 10 minutes
      pendingUsers.delete(email);
    }
  }
}, 5 * 60 * 1000); // Run every 5 minutes

export default signupRouter;
