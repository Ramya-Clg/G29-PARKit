import mongoose from 'mongoose';
import { ParkingSlot } from '../db/index.js';
import dotenv from 'dotenv';
dotenv.config();

async function createInitialParkingSlots() {
  try {
    // Check if already connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URL);
      console.log('Connected to MongoDB');
    }

    // Clear existing slots
    await ParkingSlot.deleteMany({});
    console.log('Cleared existing slots');

    // Create new slots
    const slots = [];
    for (let i = 1; i <= 10; i++) {
      slots.push({
        slotNumber: `A${i}`,
        isOccupied: false,
        level: 'A',
        reservations: []
      });
    }

    const created = await ParkingSlot.insertMany(slots);
    console.log('Created slots:', created);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the function
createInitialParkingSlots();