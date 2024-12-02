import { transporter } from "./mailTransporter.js";

const sendReminderEmail = async ({ receiver, reservationDetails }) => {
  try {
    const mailDetails = {
      from: process.env.EMAIL_USER,
      to: receiver,
      subject: "Parking Reservation Reminder",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Parking Reservation Reminder</h2>
          <p>This is a reminder for your upcoming parking reservation:</p>
          <ul>
            <li>Reservation ID: ${reservationDetails._id}</li>
            <li>Slot Number: ${reservationDetails.parkingSlot.slotNumber}</li>
            <li>Start Time: ${new Date(reservationDetails.reservationTime).toLocaleString()}</li>
            <li>Duration: ${reservationDetails.duration} hours</li>
            <li>Vehicle: ${reservationDetails.vehicleNumberPlate}</li>
          </ul>
          <p>Please arrive on time to avoid any inconvenience.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailDetails);
    console.log("Reminder email sent successfully:", info.response);
    return info;
  } catch (error) {
    console.error("Reminder email sending failed:", error);
    throw error;
  }
};

export { sendReminderEmail }; 