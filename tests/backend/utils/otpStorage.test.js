import { storeOTP, verifyOTP } from "../../../backend/utils/otpStorage.js"; // Adjust the import path

jest.useFakeTimers(); // Use fake timers to mock Date.now() behavior

describe("OTP Service", () => {
  const email = "test@example.com";
  const otp = "123456";

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  test("should store OTP and validate correctly", () => {
    // Store the OTP
    storeOTP(email, otp);

    // Simulate immediate OTP verification
    const isValid = verifyOTP(email, otp);

    expect(isValid).toBe(true); // The OTP should be valid
  });

  test("should return false if OTP is incorrect", () => {
    // Store the OTP
    storeOTP(email, otp);

    // Try to verify with an incorrect OTP
    const isValid = verifyOTP(email, "wrongOTP");

    expect(isValid).toBe(false); // The OTP should be invalid
  });

  test("should return false if OTP is not found", () => {
    // Try to verify without storing an OTP
    const isValid = verifyOTP(email, otp);

    expect(isValid).toBe(false); // The OTP should be invalid because it hasn't been stored
  });

  test("should return false if OTP has expired", () => {
    // Store the OTP
    storeOTP(email, otp);

    // Simulate the passage of 11 minutes (more than the 10-minute expiry time)
    jest.setSystemTime(Date.now() + 11 * 60 * 1000);

    // Try to verify the OTP after expiration
    const isValid = verifyOTP(email, otp);

    expect(isValid).toBe(false); // The OTP should be expired
  });

  test("should delete OTP after successful verification", () => {
    // Store the OTP
    storeOTP(email, otp);

    // Verify the OTP
    const isValid = verifyOTP(email, otp);

    // The OTP should be deleted after successful verification
    expect(isValid).toBe(true);
    expect(otpStore.has(email)).toBe(false); // OTP should no longer exist in the store
  });
});
