import express from "express";
import loginRouter from "./routes/auth/login.js";
import signupRouter from "./routes/auth/signup.js";
import otpRouter from "./routes/otp/index.js";
import parkingSlotRouter from "./routes/parkingSlot/index.js";
import cors from "cors";
import feedbackRouter from "./routes/feedbackForm/index.js";

const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());

app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/otp", otpRouter);
app.use("/parkingSlot", parkingSlotRouter);
app.user("/feedback", feedbackRouter);

app.listen(PORT, async () => {
  console.log(`The app is running on port: ${PORT}`);
});
