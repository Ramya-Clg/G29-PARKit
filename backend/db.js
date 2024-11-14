import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function connectDB() {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}testing`);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
    }
}

connectDB();

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: Number,
            required: true,
            unique: true,
        },
        checkInTime: {
            type: Date,
            default: null,
        },
        checkOutTime: {
            type: Date,
            default: null,
        },
        otp: {
            type: Number,
            default: null,
        },
        isCheckedIn: {
            type: Boolean,
            default: false,
        },
        parkingSlot: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ParkingSlot",
            default: null,
        },
    },
    { timestamps: true },
);

const parkingSlotSchema = new mongoose.Schema(
    {
        slotNumber: {
            type: String,
            required: true,
            unique: true,
        },
        isOccupied: {
            type: Boolean,
            default: false,
        },
        assignedUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        level: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

const vehicleSchema = new mongoose.Schema({
    plateNumber: {
        type: String,
        required: true,
        unique: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

const User = mongoose.model("User", userSchema);
const ParkingSlot = mongoose.model("ParkingSlot", parkingSlotSchema);

export { User, ParkingSlot };
