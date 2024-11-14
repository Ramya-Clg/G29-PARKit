import { Router } from "express";
import { sendMail } from "../../utils/index.js";
import otpGenerator from "otp-generator";
import { authorizationMiddleware } from "../../middlewares/index.js";

const otpRouter = Router();

otpRouter.get("/", authorizationMiddleware, async (req, res) => {
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
