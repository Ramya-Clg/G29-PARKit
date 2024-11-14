import express from "express";
import { sendMail } from "./utils.js";
import otpGenerator from "otp-generator";
const app = express();
const PORT = 3000;
import loginRouter from "./routes/auth/login.js";
import signupRouter from "./routes/auth/signup.js";
import { creatManyParkingSlots } from "./db/seed.js";
import otpRouter from "./routes/otp/index.js";

app.use(express.json());


app.use('/login', loginRouter)
app.use('/signup', signupRouter)
app.use('/otp', otpRouter)

app.listen(PORT, async() => {
    console.log(`The app is running on port: ${PORT}`);
});
