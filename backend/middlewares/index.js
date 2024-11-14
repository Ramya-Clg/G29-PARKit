import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
configDotenv();

export const authorizationMiddleware = (req, res, next) => {
    const response = req.headers["authorization"];
    const token = response?.split(" ")[1];
    if (!token) {
        return res.status(403).json({ msg: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        req.userEmail = decoded.email;
        console.log(req.userEmail);
    } catch (error) {
        return res.status(401).json({ msg: "Unauthorized" });
    }
    next();
};
