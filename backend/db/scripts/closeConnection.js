import mongoose from "mongoose";

async function closeMongoConnection() {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log("MongoDB connection closed successfully");
    } else {
      console.log("No active MongoDB connection to close");
    }
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
  }
}

closeMongoConnection();
