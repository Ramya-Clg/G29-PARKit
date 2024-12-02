import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function dropIndex() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");
    await mongoose.connection
      .collection("reservations")
      .dropIndex("vehiclePlateNumber_1");
    console.log("Index dropped successfully");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Connection closed");
    process.exit(0);
  }
}

dropIndex();
