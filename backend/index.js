import express from "express";
import cors from "cors";
import loginRouter from "./routes/auth/login.js";
import signupRouter from "./routes/auth/signup.js";
import otpRouter from "./routes/otp/index.js";
import parkingSlotRouter from "./routes/parkingSlot/index.js";
import feedbackRouter from "./routes/feedbackForm/index.js";
import userRouter from "./routes/user/index.js";
import adminRouter from "./routes/admin/index.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/otp", otpRouter);
app.use("/parking", parkinapgSlotRouter);
app.use("/feedback", feedbackRouter); // Fixed typo: user -> use
app.use("/user", userRouter);
app.use("/admin", adminRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: err.message,
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  // Removed unnecessary async
  console.log(`Server running on port ${PORT}`);
});
