import { Router } from "express";
import { ParkingSlot } from "../../db/db.js";
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

// Get if there is any available parking slot
parkingSlotRouter.get("/available", async (req, res) => {
  try {
    const availableSlot = await ParkingSlot.findOne({ isOccupied: false });
    if (!availableSlot) {
      return res.status(404).json({ msg: "No available slots" });
    }
    res.json({ msg: "There is at least one available slot" });
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

export default parkingSlotRouter;
