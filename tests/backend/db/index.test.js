import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { User, ParkingSlot, Reservation, Feedback, AdminStats } from "../../../backend/db/index.js"; // Update the path

let mongoServer;

// **Setup** MongoMemoryServer for a test database
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// **Cleanup** the database after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// **Teardown** the MongoMemoryServer and disconnect
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("User Model Tests", () => {
  it("should save a user with valid data", async () => {
    const user = new User({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
      phone: "9876543210",
    });

    const savedUser = await user.save();

    // **Assertions**
    expect(savedUser._id).toBeDefined(); // Check if the user is saved
    expect(savedUser.name).toBe("John Doe");
    expect(savedUser.email).toBe("john.doe@example.com");
  });

  it("should throw an error for missing required fields", async () => {
    const user = new User({
      email: "john.doe@example.com", // Missing name, password, phone
    });

    // **Expect error to be thrown**
    await expect(user.save()).rejects.toThrow();
  });

  it("should enforce unique email addresses", async () => {
    const user1 = new User({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
      phone: "9876543210",
    });
    const user2 = new User({
      name: "Jane Doe",
      email: "john.doe@example.com", // Same email as user1
      password: "password456",
      phone: "1234567890",
    });

    await user1.save();
    await expect(user2.save()).rejects.toThrow(); // **Should throw unique constraint error**
  });
});

describe("ParkingSlot Model Tests", () => {
  it("should save a parking slot successfully", async () => {
    const slot = new ParkingSlot({
      slotNumber: "A1",
      level: "1",
    });

    const savedSlot = await slot.save();

    // **Assertions**
    expect(savedSlot._id).toBeDefined();
    expect(savedSlot.slotNumber).toBe("A1");
    expect(savedSlot.isOccupied).toBe(false); // Default value
  });

  it("should enforce unique slotNumber", async () => {
    const slot1 = new ParkingSlot({ slotNumber: "A1", level: "1" });
    const slot2 = new ParkingSlot({ slotNumber: "A1", level: "2" }); // Duplicate slotNumber

    await slot1.save();
    await expect(slot2.save()).rejects.toThrow(); // **Should throw unique constraint error**
  });
});

describe("Reservation Model Tests", () => {
  it("should save a reservation successfully", async () => {
    // Create User and ParkingSlot
    const user = await new User({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
      phone: "9876543210",
    }).save();

    const slot = await new ParkingSlot({
      slotNumber: "A2",
      level: "2",
    }).save();

    // Create Reservation
    const reservation = new Reservation({
      user: user._id,
      parkingSlot: slot._id,
      vehicleNumberPlate: "ABC-1234",
      reservationTime: new Date(),
      endTime: new Date(Date.now() + 3600 * 1000), // 1 hour later
      duration: 1,
      status: "confirmed",
    });

    const savedReservation = await reservation.save();

    // **Assertions**
    expect(savedReservation._id).toBeDefined();
    expect(savedReservation.user.toString()).toBe(user._id.toString());
    expect(savedReservation.parkingSlot.toString()).toBe(slot._id.toString());
  });

  it("should fail to save reservation without required fields", async () => {
    const reservation = new Reservation({
      vehicleNumberPlate: "XYZ-5678",
    });

    await expect(reservation.save()).rejects.toThrow();
  });
});

describe("Feedback Model Tests", () => {
  it("should save feedback with valid data", async () => {
    const feedback = new Feedback({
      name: "Jane Doe",
      email: "jane.doe@example.com",
      rating: "5",
      message: "Great service and easy to use!",
    });

    const savedFeedback = await feedback.save();

    // **Assertions**
    expect(savedFeedback._id).toBeDefined();
    expect(savedFeedback.rating).toBe("5");
  });

  it("should fail to save feedback with a short message", async () => {
    const feedback = new Feedback({
      name: "Jane Doe",
      email: "jane.doe@example.com",
      rating: "5",
      message: "Bad", // Too short
    });

    await expect(feedback.save()).rejects.toThrow();
  });
});

describe("AdminStats Model Tests", () => {
  it("should initialize AdminStats with default values", async () => {
    const adminStats = new AdminStats();
    const savedStats = await adminStats.save();

    // **Assertions**
    expect(savedStats._id).toBeDefined();
    expect(savedStats.totalIncome).toBe(0);
    expect(savedStats.totalBookings).toBe(0);
  });
});
