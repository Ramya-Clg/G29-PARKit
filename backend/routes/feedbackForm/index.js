import { Router } from "express";
import { Feedback } from "../../db/index.js"; // Feedback model from your database setup
import { authorizationMiddleware } from "../../middlewares/index.js"; // Middleware for authorization
import { validateRequest } from "../../middlewares/validateRequest.js"; // Middleware for request validation
import { FeedbackSchema } from "../../types/index.js"; // Validation schema for feedback

const FeedbackRouter = Router();

// Submit feedback
FeedbackRouter.post(
  "/submit",
  validateRequest(FeedbackSchema),
  async (req, res) => {
    try {
      const feedbackData = req.body; 
      const feedback = await Feedback.create(feedbackData); 
      return res.status(201).json({ message: "Feedback submitted successfully", feedback });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      return res.status(500).json({ error: "Failed to submit feedback" });
    }
  }
);


FeedbackRouter.get(
  "/all",
  authorizationMiddleware,
  async (req, res) => {
    try {
      const feedbackList = await Feedback.findAll(); 
      return res.status(200).json(feedbackList);
    } catch (error) {
      console.error("Error retrieving feedback:", error);
      return res.status(500).json({ error: "Failed to retrieve feedback" });
    }
  }
);


FeedbackRouter.delete(
  "/delete/:id",
  authorizationMiddleware, 
  async (req, res) => {
    const { id } = req.params;
    try {
      const feedback = await Feedback.destroy({ where: { id } }); 
      if (feedback) {
        return res.status(200).json({ message: "Feedback deleted successfully" });
      } else {
        return res.status(404).json({ error: "Feedback not found" });
      }
    } catch (error) {
      console.error("Error deleting feedback:", error);
      return res.status(500).json({ error: "Failed to delete feedback" });
    }
  }
);



export default FeedbackRouter;
