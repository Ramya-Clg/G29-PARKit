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
  try {
    const { reservationDate, reservationTime, duration } = req.query;
    
    console.log("Received availability check request:", {
      reservationDate,
      reservationTime,
      duration
    });

    // First check if we have any parking slots at all
    const totalSlots = await ParkingSlot.countDocuments();
    console.log("Total parking slots in database:", totalSlots);

    // Simple query first - just find any unoccupied slot
    const anySlot = await ParkingSlot.findOne({ isOccupied: false });
    console.log("Found unoccupied slot:", anySlot ? anySlot.slotNumber : "None");

    // Convert string inputs to Date objects
    const startTime = new Date(`${reservationDate}T${reservationTime}`);
    const endTime = new Date(startTime.getTime() + parseInt(duration) * 60 * 60 * 1000);

    console.log("Checking availability between:", {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString()
    });

    // Simplified query to start with
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
                  $gte: startTime
                }
              }
            }
          }
        }
      ]
    });

    console.log("Query result:", availableSlot);

    if (!availableSlot) {
      console.log("No available slots found");
      return res.status(404).json({ 
        available: false,
        message: "No parking slots available for the selected time period." 
      });
    }

    console.log("Found available slot:", availableSlot.slotNumber);
    res.json({ 
      available: true, 
      slotNumber: availableSlot.slotNumber 
    });

  } catch (error) {
    console.error('Availability check error:', error);
    res.status(500).json({ 
      available: false,
      message: "Error checking slot availability",
      error: error.message 
    });
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

parkingSlotRouter.post(
  "/reserve",
  authorizationMiddleware,
  async (req, res) => {
    const parsedDate = ReservationSchema.safeParse(req.body);
    if (!parsedDate.success) {
      return res.status(400).json({ msg: "Invalid Data" });
    }

    const {
      reservationDate,
      reservationTime,
      Duration,
      vehicleNumberPlate,
    } = parsedDate.data;

    try {
      // First check if slot is available
      const reservationStartTime = new Date(`${reservationDate}T${reservationTime}`);
      const reservationEndTime = new Date(
        reservationStartTime.getTime() + Duration * 60 * 60 * 1000
      );

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
                          {
                            $add: [
                              "$reservationTime",
                              { $multiply: ["$reservationDuration", 60 * 60 * 1000] },
                            ],
                          },
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
        return res.status(404).json({ msg: "No available slots for the specified time." });
      }

      const reservation = new Reservation({
        user: req.user._id,
        parkingSlot: availableSlot._id,
        vehiclePlateNumber: vehicleNumberPlate,
        reservationDate: reservationStartTime,
        reservationTime: reservationStartTime,
        reservationDuration: Duration,
      });

      await reservation.save();

      // Add reservation to parking slot
      availableSlot.reservations.push(reservation._id);
      await availableSlot.save();

      res.json({
        msg: "Reservation created successfully",
        reservationId: reservation._id,
        slotNumber: availableSlot.slotNumber,
      });
    } catch (error) {
      res.status(500).json({ msg: "Internal server error", error: error.message });
    }
  },
);

// Add this new endpoint to check slots
parkingSlotRouter.get("/slots", async (req, res) => {
  try {
    const slots = await ParkingSlot.find({});
    res.json({
      totalSlots: slots.length,
      slots: slots.map(slot => ({
        slotNumber: slot.slotNumber,
        isOccupied: slot.isOccupied,
        reservationsCount: slot.reservations.length
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default parkingSlotRouter;
