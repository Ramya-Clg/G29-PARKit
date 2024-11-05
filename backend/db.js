const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/parkIt");

//User
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, required: true, unique: true },
    vehicle: {
        plateNumber: { type: String, required: true, unique: true },
        model: { type: String, required: true },
        color: { type: String }
    },
    otp: { type: String, default: null },
    checkInTime: { type: Date, default: null },
    checkOutTime: { type: Date, default: null },
    isCheckedIn: { type: Boolean, default: false },
    parkingSlot: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSlot', default: null }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;


// Parking Slot
const parkingSlotSchema = new mongoose.Schema({
    slotNumber: { type: String, required: true, unique: true },
    isOccupied: { type: Boolean, default: false },
    assignedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    level: { type: String, required: true } // e.g., "Level 1", "Basement"
}, { timestamps: true });

const ParkingSlot = mongoose.model('ParkingSlot', parkingSlotSchema);
module.exports = ParkingSlot;
