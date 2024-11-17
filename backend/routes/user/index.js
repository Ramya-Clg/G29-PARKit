import { Router } from "express";
import { authorizationMiddleware } from "../../middlewares/index.js";
import { User, ParkingSlot } from "../../db/index.js";

const userRouter = Router();

userRouter.get("/details", authorizationMiddleware, async (req, res) => {
  try {
    const email = req.email;

    // Query database for user details
    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's parking slots if any
    const parkingSlots = await ParkingSlot.find({ 
      assignedUser: user._id 
    });

    // Return user details with parking slots
    res.json({
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        parkingSlots: parkingSlots.map(slot => ({
          id: slot._id,
          slotNumber: slot.slotNumber,
          location: slot.location || `Slot ${slot.slotNumber}`,
          reservationTime: slot.reservationTime,
          duration: slot.duration
        }))
      }
    });

  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default userRouter;
