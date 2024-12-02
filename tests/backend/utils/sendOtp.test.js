import otpGenerator from "otp-generator";
import { generateOTP, sendOTP } from "../../../backend/utils/sendOtp.js"; // Adjust the import path based on your directory structure
import { transporter } from "../../../backend/utils/mailTransporter.js"; // Adjust the import path for mailTransporter

jest.mock("otp-generator"); // Mock otp-generator module
jest.mock("../../../backend/mailTransporter", () => ({
  transporter: {
    sendMail: jest.fn(),
  },
}));

describe("OTP Service", () => {
  // Test for OTP generation
  describe("generateOTP", () => {
    test("should generate a 6-digit OTP", () => {
      const otp = "123456"; // Example of what you expect the OTP to be
      otpGenerator.generate.mockReturnValue(otp); // Mock the return value of otpGenerator.generate

      const result = generateOTP();
      expect(result).toBe(otp); // Check if OTP matches the expected value
      expect(otpGenerator.generate).toHaveBeenCalledWith(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
    });
  });

  // Test for sendOTP function
  describe("sendOTP", () => {
    test("should send OTP email successfully", async () => {
      const email = "test@example.com";
      const otp = "123456";

      // Mock the behavior of sendMail to simulate email sending success
      transporter.sendMail.mockResolvedValue({
        response: "Email sent successfully",
      });

      const result = await sendOTP(email, otp);

      expect(result).toBe(true); // Ensure the function returns true on success
      expect(transporter.sendMail).toHaveBeenCalledWith({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Email Verification OTP",
        html: expect.stringContaining(otp), // Check if OTP is included in the HTML content
      });
      expect(transporter.sendMail).toHaveBeenCalledTimes(1); // Ensure sendMail was called once
    });

    test("should return false if sendMail fails", async () => {
      const email = "test@example.com";
      const otp = "123456";

      // Simulate an error from sendMail
      transporter.sendMail.mockRejectedValue(new Error("Failed to send email"));

      const result = await sendOTP(email, otp);

      expect(result).toBe(false); // Ensure the function returns false on failure
      expect(transporter.sendMail).toHaveBeenCalledTimes(1); // Ensure sendMail was called once
    });
  });
});
