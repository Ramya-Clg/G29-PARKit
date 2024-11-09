const express = require("express");
const {LoginSchema} = require("./types");
const { sendMail, sendSMS } = require("./utils");
const otpGenerator = require("otp-generator");
const { User } = require("./db");
const app = express();
const PORT = 3000;

app.use(express.json());

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

app.post("/login", (req, res) => {  
    const parsedObj = LoginSchema.safeParse(req.body);
    if (!parsedObj.success) {
        return res.status(400).json({ msg: "Invalid Format"});
    }
    const { email, password } = parsedObj.data;
    User.findOne({ email })
        .then((user) => {
            if (!user) {
                return res.status(400).json({ msg: "Invalid Credentials" });
            }
            if (user.password !== password) {
                return res.status(400).json({ msg: "Invalid Credentials" });
            }
            const { name, phone, email } = user;
            res.json({ name, phone, email });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ msg: "Internal Server Error" });
        });
});

app.listen(PORT, () => {
  console.log(`The app is running on port: ${PORT}`);
});
