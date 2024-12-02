import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import loginRouter from "./routes/loginRouter.js";
import signupRouter from "./routes/signupRouter.js";
import parkingSlotRouter from "./routes/parkingSlotRouter.js";
import feedbackRouter from "./routes/feedbackRouter.js";
import userRouter from "./routes/userRouter.js";
import adminRouter from "./routes/adminRouter.js";
import securityRouter from "./routes/securityRouter.js";

// Add this line with your other route configurations
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose
  .connect(`${process.env.MONGODB_URL}testing`)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/login", loginRouter);
app.use("/api/security", securityRouter);
app.use("/api/signup", signupRouter);
app.use("/api/parking", parkingSlotRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: err.message,
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
