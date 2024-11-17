import { Router } from "express";

const adminRouter = Router();

export default adminRouter;

adminRouter.get("/", async (req, res) => {
    res.send("Admin Dashboard");
});

