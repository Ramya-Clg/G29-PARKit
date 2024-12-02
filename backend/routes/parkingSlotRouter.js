import { Router } from "express";
import { ParkingSlot, Reservation, Payment, AdminStats } from "../db/index.js";
import { authorizationMiddleware } from "../middlewares/index.js";
import { sendMail } from "../utils/sendBookingDetails.js";

const parkingSlotRouter = Router();

const findAvailableSlot = async (startTime, endTime) => {
  try {
    const allSlots = await ParkingSlot.find({}).sort({ slotNumber: 1 });

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

parkingSlotRouter.post("/check-availability", async (req, res) => {
  try {
    const { reservationDate, reservationTime, Duration } = req.body;
    const startTime = new Date(`${reservationDate}T${reservationTime}`);
    const endTime = new Date(
      startTime.getTime() + parseInt(Duration) * 60 * 60 * 1000,
    );

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

      availableSlot.reservations.push(reservation._id);
      await availableSlot.save();

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

      const payment = new Payment({
        reservation: reservationId,
        user: req.user._id,
        amount: amount,
        duration: duration,
      });
      await payment.save();

      const adminStats = (await AdminStats.findOne()) || new AdminStats();
      adminStats.totalIncome += amount;
      adminStats.totalBookings += 1;
      await adminStats.save();

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

    if (!reservation.actualEntryTime) {
      reservation.actualEntryTime = new Date();
      reservation.status = "active";
      await reservation.save();

      return res.json({
        success: true,
        msg: "Entry time recorded successfully",
      });
    }

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
