import { transporter } from "./mailTransporter.js";

const sendMail = async ({ receiver, otp }) => {
  try {

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

    const info = await transporter.sendMail(mailDetails);
    console.log("Email sent successfully:", info.response);
    return info;

  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

export { sendMail };
