import { Reservation } from "../db/index.js";
import { sendReminderEmail } from "../utils/sendReminderEmail.js";

export class ReminderService {
  constructor() {
    this.checkInterval = 5*60*1000; // Check every 5 minutes
    this.remindersSent = new Set(); // Track sent reminders
  }

  async checkAndSendReminders() {
    try {
      const now = new Date();
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

      // Find reservations starting in about 1 hour
      const upcomingReservations = await Reservation.find({
        reservationTime: {
          $gt: now,
          $lt: oneHourFromNow
        },
        status: "confirmed"
      }).populate("user").populate("parkingSlot");

      for (const reservation of upcomingReservations) {
        // Check if reminder already sent
        if (!this.remindersSent.has(reservation._id.toString())) {
          try {
            await sendReminderEmail({
              receiver: reservation.user.email,
              reservationDetails: reservation
            });
            
            // Mark reminder as sent
            this.remindersSent.add(reservation._id.toString());
          } catch (error) {
            console.error(`Failed to send reminder for reservation ${reservation._id}:`, error);
          }
        }
      }
    } catch (error) {
      console.error("Error in reminder service:", error);
    }
  }

  start() {
    console.log("Starting reminder service...");
    this.intervalId = setInterval(
      () => this.checkAndSendReminders(),
      this.checkInterval
    );
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      console.log("Reminder service stopped.");
    }
  }
}