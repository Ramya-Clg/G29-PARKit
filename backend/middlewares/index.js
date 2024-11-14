import jwt from "jsonwebtoken";

export const authorizationMiddleware = (req, res, next) => {
    const response = req.headers["Authorization"];
    const token = response?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ msg: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        req.userEmail = decoded.email;
    } catch (error) {
        return res.status(401).json({ msg: "Unauthorized" });
    }
    next();
};
