import { User } from "../../db/index.js";
import { LoginSchema } from "../../types/index.js";
import { Router } from "express";
import jwt from "jsonwebtoken";

const loginRouter = Router();

loginRouter.post("/", async (req, res) => {
  const parsedObj = LoginSchema.safeParse(req.body);
  if (!parsedObj.success) {
    return res.status(400).json({ msg: "Invalid Format" });
  }

  const { email, password } = parsedObj.data;

  try {
    const user = await User.findOne({ email });
    console.log("Found user:", user);

    if (!user) {
      return res.status(400).json({ msg: "Invalid Username" });
    }

    if (user.password !== password) {
      return res.status(400).json({ msg: "Invalid Password" });
    }

    const tokenPayload = {
      email: user.email,
    };
    console.log("Token payload:", tokenPayload);

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    console.log("Generated token:", token);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

export default loginRouter;
