import { Router } from "express";
import { authorizationMiddleware } from "../../middlewares/index.js";
import { User, Reservation } from "../../db/index.js";

const userRouter = Router();

userRouter.get("/details", authorizationMiddleware, async (req, res) => {
  try {
    console.log('Fetching details for email:', req.email); // Debug log

    const user = await User.findOne({ email: req.email }).select("-password");
    console.log('Found user:', user); // Debug log

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Get user's reservations
    const reservations = await Reservation.find({ 
      user: user._id 
    }).populate('parkingSlot');
    
    console.log('Found reservations:', reservations); // Debug log

    // Format the reservations data
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
