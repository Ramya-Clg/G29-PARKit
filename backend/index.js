import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import loginRouter from "./routes/loginRouter.js";
import signupRouter from "./routes/signupRouter.js";
import parkingSlotRouter from "./routes/parkingSlotRouter.js";
import feedbackRouter from "./routes/feedbackRouter.js";
import userRouter from "./routes/userRouter.js";
import adminRouter from "./routes/adminRouter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/login", loginRouter);
app.use("/api/signup", signupRouter);
app.use("/api/parking", parkingSlotRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);

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
