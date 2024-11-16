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
    isCheckedIn: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: Number,
      default: null,
    },
    parkingSlot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParkingSlot",
      default: null,
    },
  },
  { timestamps: true },
);

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

const reservationSchema = new mongoose.Schema({
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
  vehiclePlateNumber: {
    type: String,
    required: true,
    unique: true,
  },
  reservationDate: {
    type: Date,
    required: true,
  },
  reservationTime: {
    type: Date,
    required: true,
  },
  reservationDuration: {
    type: Number, // Duration in hours
    required: true,
  },
});

//Feedback Message
const FeedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});
// Models
const User = mongoose.model("User", userSchema);
const ParkingSlot = mongoose.model("ParkingSlot", parkingSlotSchema);
const Reservation = mongoose.model("Reservation", reservationSchema);
const Feedback = mongoose.model("Feedback", FeedbackSchema);

// Export Models
export { User, ParkingSlot, Reservation, Feedback };
