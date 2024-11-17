import { Router } from "express";
import { ParkingSlot, Reservation } from "../../db/index.js";
import { authorizationMiddleware } from "../../middlewares/index.js";

const parkingSlotRouter = Router();

// Add this endpoint first
parkingSlotRouter.get("/available", async (req, res) => {
  try {
    const { reservationDate, reservationTime, duration } = req.query;

    console.log("Checking availability for:", {
      reservationDate,
      reservationTime,
      duration,
    });

    // Convert string inputs to Date objects
    const startTime = new Date(`${reservationDate}T${reservationTime}`);
    const endTime = new Date(
      startTime.getTime() + parseInt(duration) * 60 * 60 * 1000,
    );

    console.log("Looking for slots between:", {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    });

    // First, check if we have any slots at all
    const totalSlots = await ParkingSlot.countDocuments();
    console.log("Total slots in database:", totalSlots);

    // Find available parking slots
    const availableSlot = await ParkingSlot.findOne({
      isOccupied: false,
      $or: [
        { reservations: { $size: 0 } },
        {
          reservations: {
            $not: {
              $elemMatch: {
                reservationTime: {
                  $lt: endTime,
                  $gte: startTime,
                },
              },
            },
          },
        },
      ],
    });

    console.log("Found available slot:", availableSlot);

    if (!availableSlot) {
      return res.status(200).json({
        available: false,
        message: "No parking slots available for the selected time period.",
      });
    }

    res.status(200).json({
      available: true,
      slotNumber: availableSlot.slotNumber,
    });
  } catch (error) {
    console.error("Availability check error:", error);
    res.status(500).json({
      available: false,
      message: "Error checking slot availability",
      error: error.message,
    });
  }
});

// Add the reserve endpoint
parkingSlotRouter.post(
  "/reserve",
  authorizationMiddleware,
  async (req, res) => {
    try {
      const { reservationDate, reservationTime, Duration, vehicleNumberPlate } =
        req.body;
      console.log("Reservation request from user:", req.email); // Log email instead of ID

      if (!vehicleNumberPlate) {
        return res.status(400).json({
          success: false,
          msg: "Vehicle number plate is required",
        });
      }

      // Convert string inputs to Date objects
      const startTime = new Date(`${reservationDate}T${reservationTime}`);
      const endTime = new Date(
        startTime.getTime() + parseInt(Duration) * 60 * 60 * 1000,
      );

      // Find available parking slot
      const availableSlot = await ParkingSlot.findOne({
        isOccupied: false,
        $or: [
          { reservations: { $size: 0 } },
          {
            reservations: {
              $not: {
                $elemMatch: {
                  reservationTime: {
                    $lt: endTime,
                    $gte: startTime,
                  },
                },
              },
            },
          },
        ],
      });

      if (!availableSlot) {
        return res.status(400).json({
          success: false,
          msg: "No parking slots available for the selected time period.",
        });
      }

      // Create new reservation using req.user which was found by email
      const newReservation = {
        user: req.user._id,
        parkingSlot: availableSlot._id,
        vehicleNumberPlate: vehicleNumberPlate.toUpperCase(),
        reservationTime: startTime,
        duration: Duration,
        status: "confirmed",
      };

      console.log("Creating reservation:", newReservation); // Debug log

      const reservation = await Reservation.create(newReservation);

      // Update parking slot with new reservation
      availableSlot.reservations.push(reservation._id);
      await availableSlot.save();

      res.status(200).json({
        success: true,
        msg: "Parking slot reserved successfully",
        data: {
          reservationId: reservation._id,
          slotNumber: availableSlot.slotNumber,
          startTime: startTime,
          endTime: endTime,
          duration: Duration,
          vehicleNumberPlate: vehicleNumberPlate,
        },
      });
    } catch (error) {
      console.error("Reservation error:", error);
      res.status(500).json({
        success: false,
        msg: "Failed to reserve parking slot",
        error: error.message,
      });
    }
  },
);

// Add a test route to verify router is working
parkingSlotRouter.get("/test", (req, res) => {
  res.json({ message: "Parking router is working" });
});

export default parkingSlotRouter;
