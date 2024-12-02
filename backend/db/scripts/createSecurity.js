import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Security } from "../index.js";
import dotenv from "dotenv";

dotenv.config();

const createSecurity = async () => {
  try {
    async function connectDB() {
      try {
        await mongoose.connect(`${process.env.MONGODB_URL}testing`);
        console.log("Connected to MongoDB");
      } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
      }
    }

    await connectDB();

    const securityData = {
      name: "Security Guard",
      email: "security@example.com",
      password: "security123", 
      role: "security",
    };

    const existingSecurity = await Security.findOne({
      email: securityData.email,
    });

    if (existingSecurity) {
      console.log("Security guard already exists with this email");
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(securityData.password, salt);

    const securityDoc = new Security({
      ...securityData,
      password: hashedPassword,
    });

    await securityDoc.save();

    console.log("Security guard created successfully");
    console.log("Email:", securityData.email);
    console.log("Password:", securityData.password);
    console.log("Role:", securityData.role);
    console.log("\nSecurity guard can now:");
    console.log("1. Login at /security/login");
    console.log("2. Access verification page at /security");
  } catch (error) {
    console.error("Error creating security guard:", error);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
    process.exit(0);
  }
};

createSecurity();
