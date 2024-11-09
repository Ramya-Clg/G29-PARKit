const nodemailer = require("nodemailer");
const axios = require("axios");
require("dotenv").config();

const sendMail = ({ receiver, otp }) => {
  var mailTransporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,

    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.APP_PASSWORD,
    },
  });

  let mailDetails = {
    from: process.env.EMAIL_ID,
    to: receiver,
    subject: "OTP for checkout/checkin",
    text: `Please give this OTP at the exit ${otp}`,
  };

  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      console.log("Error Occurs");
    } else {
      console.log("Email sent successfully");
    }
  });
};

module.exports = { sendMail };
