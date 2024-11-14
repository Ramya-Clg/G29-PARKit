import { ParkingSlot } from "./db.js";

export const creatManyParkingSlots = async () => {
  const parkingSlots = [];
  for (let level = 1; level <= 2; level++) {
    for (let i = 1; i <= 50; i++) {
      const slotNumber = `L${level}-${i}`;
      parkingSlots.push({
        slotNumber,
        level: `L${level}`,
        isOccupied: false,
        assignedUser: null,
      });
    }
  }

  try {
    await ParkingSlot.insertMany(parkingSlots);
    console.log("Parking slots have been successfully seeded");
  } catch (err) {
    console.error("Error inserting parking slots:", err);
  }
};
