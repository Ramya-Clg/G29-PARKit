import mongoose from "mongoose";
import { ParkingSlot } from "../index.js";
import dotenv from "dotenv";
dotenv.config();

async function createInitialParkingSlots() {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}testing`);
    console.log("Connected to MongoDB");

    await ParkingSlot.deleteMany({});
    console.log("Cleared existing slots");

    const slots = [];
    for (let i = 1; i <= 10; i++) {
      slots.push({
        slotNumber: `A${i}`,
        isOccupied: false,
        level: "A",
        reservations: [],
      });
    }

    const created = await ParkingSlot.insertMany(slots);
    console.log("Created slots:", created);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.connection.close();

    console.log("MongoDB connection closed");
    process.exit(0);
  }
}

createInitialParkingSlots();
