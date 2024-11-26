import { Router } from "express";
import { User, Reservation } from "../db/index.js";
import { authorizationMiddleware } from "../middlewares/index.js";

const userRouter = Router();

userRouter.get("/details", authorizationMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    const reservations = await Reservation.find({
      user: req.user._id,
      status: { $in: ["confirmed", "completed"] },
    })
      .populate("parkingSlot")
      .sort({ reservationTime: -1 })
      .lean();

    res.json({
      success: true,
      data: {
        user: {
          name: user.name,
          email: user.email,
          phoneNumber: user.phone,
          role: user.role,
        },
        reservations: reservations.map((reservation) => ({
          id: reservation._id,
          parkingSlot: {
            slotNumber: reservation.parkingSlot?.slotNumber,
          },
          vehicleNumberPlate: reservation.vehicleNumberPlate,
          reservationTime: reservation.reservationTime,
          endTime: reservation.endTime,
          duration: reservation.duration,
          status: reservation.status,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({
      success: false,
      msg: "Failed to fetch user details",
      error: error.message,
    });
  }
});

export default userRouter;
