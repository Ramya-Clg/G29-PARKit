import { Router } from "express";
import { User, Reservation } from "../../db/index.js";
import { authorizationMiddleware } from "../../middlewares/index.js";

const userRouter = Router();

// Get user details with their reservations
userRouter.get("/details", authorizationMiddleware, async (req, res) => {
    try {
        // Debug log
        console.log("Fetching details for user:", req.user._id);

        const user = await User.findById(req.user._id)
            .select('-password') // Exclude password
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "User not found"
            });
        }

        // Get user's reservations
        const reservations = await Reservation.find({
            user: req.user._id,
            status: { $in: ["confirmed", "completed"] }
        })
            .populate('parkingSlot')
            .sort({ reservationTime: -1 })
            .lean();

        res.json({
            success: true,
            data: {
                user: {
                    name: user.name,
                    email: user.email,
                    phoneNumber: user.phone,
                    role: user.role
                },
                reservations: reservations.map(reservation => ({
                    id: reservation._id,
                    slotNumber: reservation.parkingSlot.slotNumber,
                    vehicleNumberPlate: reservation.vehicleNumberPlate,
                    startTime: reservation.reservationTime,
                    endTime: reservation.endTime,
                    duration: reservation.duration,
                    status: reservation.status
                }))
            }
        });

    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({
            success: false,
            msg: "Failed to fetch user details",
            error: error.message
        });
    }
});

export default userRouter;
