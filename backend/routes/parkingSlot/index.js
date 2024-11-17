import { Router } from "express";
import { ParkingSlot, Reservation } from "../../db/index.js";
import { authorizationMiddleware } from "../../middlewares/index.js";

const parkingSlotRouter = Router();

// Helper function to check slot availability
const isSlotAvailable = async (startTime, endTime) => {
  const overlappingSlot = await ParkingSlot.findOne({
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

  return !overlappingSlot;
};

// Endpoint to check availability
parkingSlotRouter.post("/check-availability", async (req, res) => {
  try {
    const { reservationDate, reservationTime, Duration } = req.body;

    // Convert string inputs to Date objects
    const startTime = new Date(`${reservationDate}T${reservationTime}`);
    const endTime = new Date(startTime.getTime() + parseInt(Duration) * 60 * 60 * 1000);

    const available = await isSlotAvailable(startTime, endTime);

    res.json({
      success: true,
      available,
      message: available ? "Slot available" : "No slots available for selected time"
    });

  } catch (error) {
    console.error("Availability check error:", error);
    res.status(500).json({
      success: false,
      message: "Error checking availability"
    });
  }
});

// Booking endpoint
parkingSlotRouter.post("/reserve", authorizationMiddleware, async (req, res) => {
  try {
    const { reservationDate, reservationTime, Duration, vehicleNumberPlate } = req.body;

    if (!vehicleNumberPlate) {
      return res.status(400).json({
        success: false,
        msg: "Vehicle number plate is required",
      });
    }

    // Convert string inputs to Date objects
    const startTime = new Date(`${reservationDate}T${reservationTime}`);
    const endTime = new Date(startTime.getTime() + parseInt(Duration) * 60 * 60 * 1000);

    // Check availability first
    const available = await isSlotAvailable(startTime, endTime);
    if (!available) {
      return res.status(400).json({
        success: false,
        msg: "No parking slots available for the selected time period.",
      });
    }

    // Find first available slot
    const availableSlot = await ParkingSlot.findOne({
      reservations: {
        $not: {
          $elemMatch: {
            $or: [
              {
                reservationTime: { $lt: endTime },
                endTime: { $gt: startTime }
              }
            ]
          }
        }
      }
    });

    // Create new reservation
    const newReservation = {
      user: req.user._id,
      parkingSlot: availableSlot._id,
      vehicleNumberPlate: vehicleNumberPlate.toUpperCase(),
      reservationTime: startTime,
      endTime: endTime,
      duration: Duration,
      status: "confirmed",
    };

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
});

// Add checkout endpoint
parkingSlotRouter.post("/checkout", authorizationMiddleware, async (req, res) => {
  try {
    const { reservationId } = req.body;
    
    // Find the reservation
    const reservation = await Reservation.findById(reservationId)
      .populate('parkingSlot');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        msg: "Reservation not found"
      });
    }

    // Verify that the reservation belongs to the user
    if (reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        msg: "Not authorized to checkout this reservation"
      });
    }

    // Update reservation status
    reservation.status = 'completed';
    await reservation.save();

    // Remove reservation from parking slot
    const parkingSlot = reservation.parkingSlot;
    parkingSlot.reservations = parkingSlot.reservations.filter(
      res => res.toString() !== reservationId
    );
    await parkingSlot.save();

    res.status(200).json({
      success: true,
      msg: "Checkout successful",
      data: {
        reservationId,
        slotNumber: parkingSlot.slotNumber
      }
    });

  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({
      success: false,
      msg: "Failed to checkout",
      error: error.message
    });
  }
});

// Add a test route to verify router is working
parkingSlotRouter.get("/test", (req, res) => {
  res.json({ message: "Parking router is working" });
});

export default parkingSlotRouter;
