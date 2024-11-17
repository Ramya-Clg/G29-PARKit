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

// User Schema
const UserSchema = new mongoose.Schema(
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
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  income: {
    type: Number,
    default: 0,
  },
});

// Parking Slot Schema
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
    reservations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reservation",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const ReservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parkingSlot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParkingSlot",
      required: true,
    },
    vehicleNumberPlate: {
      type: String,
      required: true,
    },
    reservationTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "confirmed",
    },
  },
  {
    timestamps: true,
  },
);

// Add index for faster queries
ReservationSchema.index({ reservationTime: 1, endTime: 1 });

// Explicitly create a non-unique index
ReservationSchema.index({ vehicleNumberPlate: 1 }, { unique: false });

// Clear existing model if it exists
mongoose.models = {};

//Feedback Message
const FeedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
    },
    rating: {
      type: String,
      required: true,
      enum: ["1", "2", "3", "4", "5"],
    },
    message: {
      type: String,
      required: true,
      minlength: 10,
    },
  },
  { timestamps: true },
);

// Models
const User = mongoose.model("User", UserSchema);
const ParkingSlot = mongoose.model("ParkingSlot", parkingSlotSchema);
const Reservation = mongoose.model("Reservation", ReservationSchema);
const Feedback = mongoose.model("Feedback", FeedbackSchema);

// Export Models
export { User, ParkingSlot, Reservation, Feedback };
