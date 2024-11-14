import { SignupSchema } from "../../types/index.js";
import { User } from "../../db.js";
import { Router } from "express";
import jwt from "jsonwebtoken";

const signupRouter = Router();

signupRouter.post("/signup", async (req, res) => {
    const parsedObj = SignupSchema.safeParse(req.body);
    if (!parsedObj.success)
        return res.status(400).json({ msg: "Invalid Format" });
    const { name, email, password } = parsedObj.data;
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User Already Exists" });
    try {
        const newUser = new User({ name, email, password, phone });
        await newUser.save();
        const token = jwt.sign({ email, name }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "user already exists" });
    }
});

export default signupRouter;