import express from "express";
import { sendMail } from "./utils.js";
import otpGenerator from "otp-generator";
const app = express();
const PORT = 3000;
import loginRouter from "./routes/auth/login.js";
import signupRouter from "./routes/auth/signup.js";

app.use(express.json());
app.use('/login', loginRouter)
app.use('/signup', signupRouter)

app.get("/otp", (req, res) => {
    const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
    });

    sendMail({
        receiver: "@gmail.com",
        otp: otp,
    });

    res.json({
        msg: "otp sent",
    });
});





app.listen(PORT, () => {
    console.log(`The app is running on port: ${PORT}`);
});
