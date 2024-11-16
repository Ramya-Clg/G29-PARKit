import { Router } from "express";
import { ParkingSlot, Reservation } from "../../db/index.js";
import { ReservationSchema } from "../../types/index.js";
import { authorizationMiddleware } from "../../middlewares/index.js";
const parkingSlotRouter = Router();

// Get a specific parking slot by slotId
parkingSlotRouter.get("/:slotId", async (req, res) => {
    const { slotId } = req.params;
    try {
        const slot = await ParkingSlot.findOne({ slotNumber: slotId });
        if (!slot) {
            return res.status(404).json({ msg: "Slot not found" });
        }
        if (slot.isOccupied) {
            return res.status(400).json({ msg: "Slot is already occupied" });
        }
        res.json({ msg: "Slot is not occupied" });
    } catch (error) {
        res
            .status(500)
            .json({ msg: "Internal server error", error: error.message });
    }
});

parkingSlotRouter.get("/available", async (req, res) => {
    const { reservationDate, reservationTime, duration } = req.query;

    if (!reservationDate || !reservationTime || !duration) {
        return res.status(400).json({ msg: "Please provide date, time, and duration." });
    }

    try {
        // Convert query parameters to Date objects
        const reservationStartTime = new Date(`${reservationDate}T${reservationTime}`);
        const reservationEndTime = new Date(reservationStartTime.getTime() + duration * 60 * 60 * 1000);

        // Find a slot that has no conflicting reservations
        const availableSlot = await ParkingSlot.findOne({
            isOccupied: false,
            $or: [
                { reservations: { $exists: false } },
                {
                    reservations: {
                        $not: {
                            $elemMatch: {
                                $and: [
                                    { reservationTime: { $lt: reservationEndTime } },
                                    {
                                        $expr: {
                                            $lt: [
                                                { $add: ["$reservationTime", { $multiply: ["$reservationDuration", 60 * 60 * 1000] }] },
                                                reservationStartTime,
                                            ],
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
            ],
        });

        if (!availableSlot) {
            return res.status(404).json({ msg: "No available slots for the specified date and time." });
        }

        res.json({
            msg: "Slot is available",
            slotNumber: availableSlot._id,
        });
    } catch (error) {
        res
            .status(500)
            .json({ msg: "Internal server error", error: error.message });
    }
});


// Occupy a parking slot
parkingSlotRouter.post("/:slotId", async (req, res) => {
    const { slotId } = req.params;
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ msg: "User ID is required" });
    }

    try {
        const slot = await ParkingSlot.findOne({ slotNumber: slotId });
        if (!slot) {
            return res.status(404).json({ msg: "Slot not found" });
        }
        if (slot.isOccupied) {
            return res.status(400).json({ msg: "Slot is already occupied" });
        }
        slot.assignedUser = userId;
        slot.isOccupied = true;
        await slot.save();
        res.json({ msg: "Slot is occupied" });
    } catch (error) {
        res
            .status(500)
            .json({ msg: "Internal server error", error: error.message });
    }
});

parkingSlotRouter.post("/reserve", authorizationMiddleware, async (req, res) => {
    const parsedDate = ReservationSchema.safeParse(req.body);
    if (!parsedDate.success) {
        return res.status(400).json({ msg: "Invalid Data" });
    }

    const { reservationDate, reservationTime, Duration, vehicleNumberPlate, parkingSlotId } = parsedDate.data;

    try {
        const reservation = new Reservation({
            user: req.user._id,
            parkingSlot: parkingSlotId,
            vehiclePlateNumber: vehicleNumberPlate,
            reservationDate,
            reservationTime,
            reservationDuration: Duration,
        });

        await reservation.save();

        res.json({
            msg: "Reservation created successfully",
            reservationId: reservation._id,
            slotNumber: availableSlot.slotNumber,
        });
    } catch (error) {
        res.status(500).json({ msg: "Internal server error", error: error.message });
    }
});



export default parkingSlotRouter;
