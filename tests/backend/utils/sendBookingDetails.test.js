import { sendMail } from "../../../backend/utils/sendBookingDetails.js"; // Adjust the import path as needed
import { transporter } from "../../../backend/utils/mailTransporter.js"; // Adjust the import path for mailTransporter

jest.mock("../../../backend/mailTransporter", () => ({
  transporter: {
    sendMail: jest.fn(),
  },
}));

describe("sendMail", () => {
  test("should send a confirmation email successfully", async () => {
    const receiver = "test@example.com";
    const otp = "123456";
    
    // Mock sendMail to resolve successfully
    transporter.sendMail.mockResolvedValue({ response: "Email sent successfully" });

    const result = await sendMail({ receiver, otp });

    expect(result.response).toBe("Email sent successfully"); // Ensure the email was sent successfully
    expect(transporter.sendMail).toHaveBeenCalledWith({
      from: process.env.EMAIL_USER,
      to: receiver,
      subject: "Parking Reservation Confirmation",
      html: expect.stringContaining(otp), // Ensure the OTP is included in the HTML content
    });
    expect(transporter.sendMail).toHaveBeenCalledTimes(1); // Ensure sendMail was called once
  });

  test("should throw an error if email sending fails", async () => {
    const receiver = "test@example.com";
    const otp = "123456";
    
    // Mock sendMail to simulate an error
    transporter.sendMail.mockRejectedValue(new Error("Failed to send email"));

    try {
      await sendMail({ receiver, otp });
    } catch (error) {
      expect(error.message).toBe("Failed to send email"); // Ensure the error is handled properly
      expect(transporter.sendMail).toHaveBeenCalledTimes(1); // Ensure sendMail was called once
    }
  });
});
