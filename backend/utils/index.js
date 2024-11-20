import nodemailer from "nodemailer";

const sendMail = async ({ receiver, otp }) => {
  try {
    // Log environment variables (for debugging)
    console.log("Email User:", process.env.EMAIL_USER);
    console.log("Receiver:", receiver);

    // Create transporter with the same configuration as the working OTP implementation
    const mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailDetails = {
      from: process.env.EMAIL_USER,
      to: receiver,
      subject: "Parking Reservation Confirmation",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Parking Reservation is Confirmed!</h2>
          <p>Your Reservation ID is: <strong>${otp}</strong></p>
          <p>Please keep this ID for your records. You'll need it when checking out.</p>
          <br>
          <p>Thank you for using our parking service!</p>
        </div>
      `
    };

    const info = await mailTransporter.sendMail(mailDetails);
    console.log("Email sent successfully:", info.response);
    return info;

  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

export { sendMail };
