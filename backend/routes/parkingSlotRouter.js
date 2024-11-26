import { Router } from "express";
import { ParkingSlot, Reservation, Payment, AdminStats } from "../db/index.js";
import { authorizationMiddleware } from "../middlewares/index.js";
import { sendMail } from "../utils/sendBookingDetails.js";

const parkingSlotRouter = Router();

// Helper function to check slot availability
const isSlotAvailable = async (startTime, endTime) => {
  // Find all slots that have overlapping reservations with confirmed status
  const occupiedSlots = await ParkingSlot.find({
    'reservations': {
      $elemMatch: {
        status: "confirmed",
        reservationTime: { $lt: endTime },
        endTime: { $gt: startTime }
      }
    }
  }).select('_id');

  // Get all slots that are not in the occupied slots
  const availableSlots = await ParkingSlot.find({
    _id: { $nin: occupiedSlots.map(slot => slot._id) }
  });

  return availableSlots.length > 0;
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

    // Debug log to check user ID
    console.log("User ID from token:", req.user._id);

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        msg: "User not authenticated"
      });
    }

    if (!vehicleNumberPlate) {
      return res.status(400).json({
        success: false,
        msg: "Vehicle number plate is required",
      });
    }

    const startTime = new Date(`${reservationDate}T${reservationTime}`);
    const endTime = new Date(startTime.getTime() + parseInt(Duration) * 60 * 60 * 1000);

    // Validate dates
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return res.status(400).json({
        success: false,
        msg: "Invalid date or time format",
      });
    }

    // Find an available slot with updated query
    const availableSlot = await ParkingSlot.findOne({
      reservations: {
        $not: {
          $elemMatch: {
            status: "confirmed",
            reservationTime: { $lt: endTime },
            endTime: { $gt: startTime }
          }
        }
      }
    }).sort({ slotNumber: 1 });

    if (!availableSlot) {
      return res.status(400).json({
        success: false,
        msg: "No parking slots available for the selected time period.",
      });
    }

    // Create new reservation
    const reservation = new Reservation({
      user: req.user._id,
      parkingSlot: availableSlot._id,
      vehicleNumberPlate: vehicleNumberPlate.toUpperCase(),
      reservationTime: startTime,
      endTime: endTime,
      duration: Duration,
      status: "confirmed",
    });

    await reservation.save();

    // Update parking slot (modified to not set isOccupied permanently)
    availableSlot.reservations.push(reservation._id);
    // Only set isOccupied if the reservation starts now
    const now = new Date();
    if (startTime <= now && endTime > now) {
      availableSlot.isOccupied = true;
    }
    await availableSlot.save();
    console.log("herere")
    console.log(req.user.email);
    console.log(reservation._id);
    // Send confirmation email
    try {
      console.log("Attempting to send email to:", req.user.email);
      await sendMail({
        receiver: req.user.email,
        otp: reservation._id.toString() // Convert ObjectId to string
      });
      console.log("Email sent successfully");
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Continue with successful reservation response but log the error
    }

    res.status(200).json({
      success: true,
      msg: "Parking slot reserved successfully. Check your email for confirmation details.",
      data: {
        reservationId: reservation._id,
        slotNumber: availableSlot.slotNumber,
        startTime,
        endTime,
        duration: Duration,
        vehicleNumberPlate
      }
    });

  } catch (error) {
    console.error("Reservation error:", error);
    res.status(500).json({
      success: false,
      msg: "Failed to reserve parking slot",
      error: error.message,
      debug: process.env.NODE_ENV === 'development' ? {
        userId: req.user?._id,
        requestBody: req.body
      } : undefined
    });
  }
});

// Add checkout endpoint
parkingSlotRouter.post("/checkout", authorizationMiddleware, async (req, res) => {
  try {
    console.log(req.body)
    const { reservationId, amount, duration } = req.body;
    
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

    // Create payment record
    const payment = new Payment({
      reservation: reservationId,
      user: req.user._id,
      amount: amount,
      duration: duration
    });
    await payment.save();

    // Update admin stats
    const adminStats = await AdminStats.findOne() || new AdminStats();
    adminStats.totalIncome += amount;
    adminStats.totalBookings += 1;
    await adminStats.save();

    // Update reservation status
    reservation.status = "completed";
    await reservation.save();

    // Check if there are any active reservations for this slot
    const activeReservations = await Reservation.find({
      parkingSlot: reservation.parkingSlot._id,
      status: "confirmed",
      _id: { $ne: reservationId }
    });

    // Only mark as unoccupied if there are no other active reservations
    if (activeReservations.length === 0) {
      await ParkingSlot.findByIdAndUpdate(
        reservation.parkingSlot._id,
        {
          isOccupied: false,
          $pull: { reservations: reservationId }
        }
      );
    }

    res.status(200).json({
      success: true,
      msg: "Checkout and payment successful",
      data: {
        reservationId,
        slotNumber: reservation.parkingSlot.slotNumber,
        amountPaid: amount,
        duration: duration
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
