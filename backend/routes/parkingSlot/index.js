import { Router } from "express";
import { ParkingSlot, Reservation } from "../../db/index.js";
import { authorizationMiddleware } from "../../middlewares/index.js";

const parkingSlotRouter = Router();

// Add this endpoint first
parkingSlotRouter.get("/available", async (req, res) => {
  try {
    const { reservationDate, reservationTime, duration } = req.query;

    // Convert string inputs to Date objects
    const startTime = new Date(`${reservationDate}T${reservationTime}`);
    const endTime = new Date(startTime.getTime() + parseInt(duration) * 60 * 60 * 1000);

    // Find slots with overlapping reservations
    const overlappingSlots = await ParkingSlot.find({
      reservations: {
        $elemMatch: {
          $or: [
            {
              reservationTime: { $lt: endTime },
              endTime: { $gt: startTime }
            }
          ]
        }
      }
    });

    // Count total available slots
    const totalSlots = await ParkingSlot.countDocuments();
    const overlappingCount = overlappingSlots.length;
    const availableCount = totalSlots - overlappingCount;

    if (availableCount <= 0) {
      return res.status(200).json({
        available: false,
        message: "No parking slots available for the selected time period.",
      });
    }

    res.status(200).json({
      available: true,
      slotsAvailable: availableCount
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
      console.log("Reservation request from user:", req.email);

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

      console.log('Requested time slot:', {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      });

      // Find parking slots with overlapping reservations
      const overlappingSlots = await ParkingSlot.find({
        reservations: {
          $elemMatch: {
            $or: [
              // Check if any existing reservation overlaps with the new time slot
              {
                reservationTime: { $lt: endTime },
                endTime: { $gt: startTime }
              }
            ]
          }
        }
      }).populate('reservations');

      console.log('Slots with overlapping reservations:', overlappingSlots.map(slot => slot.slotNumber));

      // Find an available slot that's not in the overlapping slots
      const availableSlot = await ParkingSlot.findOne({
        isOccupied: false,
        _id: { $nin: overlappingSlots.map(slot => slot._id) }
      });

      if (!availableSlot) {
        return res.status(400).json({
          success: false,
          msg: "No parking slots available for the selected time period.",
        });
      }

      // Create new reservation
      const newReservation = {
        user: req.user._id,
        parkingSlot: availableSlot._id,
        vehicleNumberPlate: vehicleNumberPlate.toUpperCase(),
        reservationTime: startTime,
        endTime: endTime, // Add end time to reservation
        duration: Duration,
        status: "confirmed",
      };

      console.log("Creating reservation:", newReservation);

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
