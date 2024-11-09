const mongoose = require("mongoose");
mongoose.connect(`${process.env.MONGODB_URL}parkit`);

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
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    vehicle: {
      plateNumber: {
        type: String,
        required: true,
        unique: true,
      },
      model: {
        type: String,
        required: true,
      },
      color: {
        type: String,
      },
    },
    // otp: { type: String, default: null },
    // checkInTime: { type: Date, default: null },
    // checkOutTime: { type: Date, default: null },
    // isCheckedIn: { type: Boolean, default: false },
    // parkingSlot: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSlot', default: null }
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

const User = mongoose.model("User", userSchema);
const ParkingSlot = mongoose.model("ParkingSlot", parkingSlotSchema);
module.exports = { User, ParkingSlot };
