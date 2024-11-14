import { User } from "../../db/db.js";
import { LoginSchema } from "../../types/index.js";
import { Router } from "express";

const loginRouter = Router();

loginRouter.post("/", (req, res) => {
    const parsedObj = LoginSchema.safeParse(req.body);
    if (!parsedObj.success) {
        return res.status(400).json({ msg: "Invalid Format" });
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
            const token = jwt.sign({ name, phone, email }, process.env.JWT_SECRET);
            res.json({ token });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ msg: "Internal Server Error" });
        });
});

export default loginRouter;