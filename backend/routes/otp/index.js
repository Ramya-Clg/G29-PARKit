import { Router } from "express";
import { sendMail } from "../../utils.js";
import otpGenerator from "otp-generator";

const otpRouter = Router();

otpRouter.get("/", (req, res) => {
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

export default otpRouter;