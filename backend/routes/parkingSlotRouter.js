import { Router } from "express";
import { ParkingSlot, Reservation, Payment, AdminStats } from "../db/index.js";
import { authorizationMiddleware } from "../middlewares/index.js";
import { sendMail } from "../utils/sendBookingDetails.js";

const parkingSlotRouter = Router();

// Helper function to check slot availability and return an available slot
const findAvailableSlot = async (startTime, endTime) => {
  try {
    // Get all parking slots
    const allSlots = await ParkingSlot.find({}).sort({ slotNumber: 1 });

    // For each slot, check if it has any overlapping reservations
    for (const slot of allSlots) {
      const overlappingReservation = await Reservation.findOne({
        parkingSlot: slot._id,
        status: "confirmed",
        reservationTime: { $lt: endTime },
        endTime: { $gt: startTime },
      });

      if (!overlappingReservation) {
        return slot;
      }
    }
    return null;
  } catch (error) {
    console.error("Error finding available slot:", error);
    throw error;
  }
};

// Endpoint to check availability
parkingSlotRouter.post("/check-availability", async (req, res) => {
  try {
    const { reservationDate, reservationTime, Duration } = req.body;
    const startTime = new Date(`${reservationDate}T${reservationTime}`);
    const endTime = new Date(
      startTime.getTime() + parseInt(Duration) * 60 * 60 * 1000,
    );

    // Check if the requested time is in the past
    const currentTime = new Date();
    if (startTime < currentTime) {
      return res.json({
        success: true,
        available: false,
        message: "Cannot book slots in the past",
      });
    }

    const availableSlot = await findAvailableSlot(startTime, endTime);
    const available = !!availableSlot;

    res.json({
      success: true,
      available,
      message: available
        ? "Slot available"
        : "No slots available for selected time",
    });
  } catch (error) {
    console.error("Availability check error:", error);
    res.status(500).json({
      success: false,
      message: "Error checking availability",
    });
  }
});

// Booking endpoint
parkingSlotRouter.post(
  "/reserve",
  authorizationMiddleware,
  async (req, res) => {
    try {
      const { reservationDate, reservationTime, Duration, vehicleNumberPlate } =
        req.body;

      if (!req.user?._id || !vehicleNumberPlate) {
        return res.status(400).json({
          success: false,
          msg: !req.user?._id
            ? "User not authenticated"
            : "Vehicle number plate is required",
        });
      }

      const startTime = new Date(`${reservationDate}T${reservationTime}`);
      const endTime = new Date(
        startTime.getTime() + parseInt(Duration) * 60 * 60 * 1000,
      );

      // Check if the requested time is in the past
      const currentTime = new Date();
      if (startTime < currentTime) {
        return res.status(400).json({
          success: false,
          msg: "Cannot book slots in the past",
        });
      }

      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        return res.status(400).json({
          success: false,
          msg: "Invalid date or time format",
        });
      }

      // Check for existing vehicle reservation
      const existingVehicleReservation = await Reservation.findOne({
        vehicleNumberPlate: vehicleNumberPlate.toUpperCase(),
        status: "confirmed",
        reservationTime: { $lt: endTime },
        endTime: { $gt: startTime },
      });

      if (existingVehicleReservation) {
        return res.status(400).json({
          success: false,
          msg: "This vehicle already has a reservation for the selected time period",
        });
      }

      const availableSlot = await findAvailableSlot(startTime, endTime);
      if (!availableSlot) {
        return res.status(400).json({
          success: false,
          msg: "No parking slots available for the selected time period",
        });
      }

      // Create reservation
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

      // Update parking slot
      availableSlot.reservations.push(reservation._id);
      await availableSlot.save();

      // Send confirmation email
      try {
        await sendMail({
          receiver: req.user.email,
          otp: reservation._id.toString(),
        });
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }

      res.status(200).json({
        success: true,
        msg: "Parking slot reserved successfully",
        data: {
          reservationId: reservation._id,
          slotNumber: availableSlot.slotNumber,
          startTime,
          endTime,
          duration: Duration,
          vehicleNumberPlate,
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

// Checkout endpoint
parkingSlotRouter.post(
  "/checkout",
  authorizationMiddleware,
  async (req, res) => {
    try {
      const { reservationId, amount, duration } = req.body;

      const reservation =
        await Reservation.findById(reservationId).populate("parkingSlot");

      if (!reservation) {
        return res.status(404).json({
          success: false,
          msg: "Reservation not found",
        });
      }

      if (reservation.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          msg: "Not authorized to checkout this reservation",
        });
      }

      // Create payment record
      const payment = new Payment({
        reservation: reservationId,
        user: req.user._id,
        amount: amount,
        duration: duration,
      });
      await payment.save();

      // Update admin stats
      const adminStats = (await AdminStats.findOne()) || new AdminStats();
      adminStats.totalIncome += amount;
      adminStats.totalBookings += 1;
      await adminStats.save();

      // Update reservation status
      reservation.status = "completed";
      await reservation.save();

      res.status(200).json({
        success: true,
        msg: "Checkout and payment successful",
        data: {
          reservationId,
          slotNumber: reservation.parkingSlot.slotNumber,
          amountPaid: amount,
          duration: duration,
        },
      });
    } catch (error) {
      console.error("Checkout error:", error);
      res.status(500).json({
        success: false,
        msg: "Failed to checkout",
        error: error.message,
      });
    }
  },
);

parkingSlotRouter.post("/verify-entry", async (req, res) => {
  try {
    const { bookingId } = req.body;

    const reservation = await Reservation.findById(bookingId);
    if (!reservation) {
      return res.status(404).json({
        success: false,
        msg: "Booking not found",
      });
    }

    // if (reservation.status !== "confirmed") {
    //   return res.status(400).json({
    //     success: false,
    //     msg: "Invalid booking status",
    //   });
    // }

    // If entry time doesn't exist, set it (entry)
    if (!reservation.actualEntryTime) {
      reservation.actualEntryTime = new Date();
      reservation.status = "active";
      await reservation.save();

      return res.json({
        success: true,
        msg: "Entry time recorded successfully",
      });
    }

    // If entry time exists but exit time doesn't, set exit time
    if (!reservation.actualExitTime) {
      reservation.actualExitTime = new Date();
      reservation.status = "completed";
      await reservation.save();

      return res.json({
        success: true,
        msg: "Exit time recorded successfully",
      });
    }

    return res.status(400).json({
      success: false,
      msg: "Booking already completed",
    });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({
      success: false,
      msg: "Failed to process verification",
    });
  }
});

export default parkingSlotRouter;
