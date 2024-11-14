import { SignupSchema } from "../../types/index.js";
import { User } from "../../db/db.js";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
configDotenv();

const signupRouter = Router();

signupRouter.post("/", async (req, res) => {
  const parsedObj = SignupSchema.safeParse(req.body);
  if (!parsedObj.success) {
    return res.status(400).json({ msg: "Invalid Format" });
  }

  const { name, email, password, phone } = parsedObj.data;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User Already Exists" });
    }
  } catch (error) {
    console.log(error);
  }

  try {
    const newUser = new User({ name, email, password, phone });
    await newUser.save();
    const token = jwt.sign(
      {
        email: newUser.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" },
    );
    res.json({ token });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

export default signupRouter;
