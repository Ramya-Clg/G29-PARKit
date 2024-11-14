import { User } from "../../db/db.js";
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

    if (!user) {
      return res.status(400).json({ msg: "Invalid Username" });
    }

    if (user.password !== password) {
      return res.status(400).json({ msg: "Invalid Password" });
    }

    try {
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      res.json({ token });
    } catch (error) {
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

export default loginRouter;
