import { Router } from "express";
import { authorizationMiddleware } from "../../middlewares/index.js";
import { User, Reservation } from "../../db/index.js";

const userRouter = Router();

userRouter.get("/details", authorizationMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.email }).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Get user's active reservations only
    const reservations = await Reservation.find({ 
      user: user._id,
      status: 'confirmed' // Only get active reservations
    }).populate('parkingSlot');
    
    const parkingSlots = reservations.map(reservation => ({
      _id: reservation._id,
      slotNumber: reservation.parkingSlot.slotNumber,
      vehicleNumberPlate: reservation.vehicleNumberPlate,
      reservationTime: reservation.reservationTime,
      duration: reservation.duration,
      status: reservation.status
    }));

    res.json({
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        parkingSlots: parkingSlots
      }
    });

  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

export default userRouter;
