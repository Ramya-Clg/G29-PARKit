import { Router } from "express";
import { Feedback } from "../db/index.js"; 
import { authorizationMiddleware } from "../middlewares/index.js"; 
import { FeedbackSchema } from "../types/index.js";

const feedbackRouter = Router();

feedbackRouter.post("/submit", async (req, res) => {
  try {
    console.log("Received feedback data:", req.body);

    const parsedData = FeedbackSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        msg: "Invalid input",
        errors: parsedData.error.errors,
      });
    }

    const feedbackData = parsedData.data;
    const feedback = await Feedback.create(feedbackData);

    return res.status(201).json({
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return res.status(500).json({
      error: "Failed to submit feedback",
      details: error.message,
    });
  }
});

feedbackRouter.get("/all", authorizationMiddleware, async (req, res) => {
  try {
    const feedbackList = await Feedback.findAll();
    return res.status(200).json(feedbackList);
  } catch (error) {
    console.error("Error retrieving feedback:", error);
    return res.status(500).json({ error: "Failed to retrieve feedback" });
  }
});

feedbackRouter.delete(
  "/delete/:id",
  authorizationMiddleware,
  async (req, res) => {
    const { id } = req.params;
    try {
      const feedback = await Feedback.destroy({ where: { id } });
      if (feedback) {
        return res
          .status(200)
          .json({ message: "Feedback deleted successfully" });
      } else {
        return res.status(404).json({ error: "Feedback not found" });
      }
    } catch (error) {
      console.error("Error deleting feedback:", error);
      return res.status(500).json({ error: "Failed to delete feedback" });
    }
  },
);

export default feedbackRouter;
