import nodemailer from "nodemailer";
import { transporter } from "../../../../backend/utils/mailTransporter.js"; // Adjust the import based on the actual path

// Mock nodemailer
jest.mock("nodemailer");

describe("Email Transporter", () => {
  let sendMailMock;

  beforeAll(() => {
    // Create a mock for the sendMail method
    sendMailMock = jest.fn().mockResolvedValue({ success: true });
    nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });
  });

  test("should create a transporter with correct config", () => {
    // Check if the transporter is created with the correct configuration
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  });

  test("should send an email with correct data", async () => {
    // Sample email data
    const mailOptions = {
      from: "test@example.com",
      to: "recipient@example.com",
      subject: "Test Email",
      text: "This is a test email",
    };

    // Call the sendMail function
    await transporter.sendMail(mailOptions);

    // Check if sendMail was called with the correct email data
    expect(sendMailMock).toHaveBeenCalledWith(mailOptions);
    expect(sendMailMock).toHaveBeenCalledTimes(1);
  });

  test("should handle sendMail errors", async () => {
    // Mock sendMail to throw an error
    sendMailMock.mockRejectedValue(new Error("Email sending failed"));

    // Sample email data
    const mailOptions = {
      from: "test@example.com",
      to: "recipient@example.com",
      subject: "Test Email",
      text: "This is a test email",
    };

    try {
      // Call the sendMail function and expect it to throw
      await transporter.sendMail(mailOptions);
    } catch (error) {
      // Check that the error was handled correctly
      expect(error.message).toBe("Email sending failed");
    }
  });
});
