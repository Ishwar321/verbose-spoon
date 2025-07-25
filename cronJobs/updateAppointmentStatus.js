const cron = require('node-cron');
const Appointment = require('../models/appointmentModel');

// Runs every 10 minutes
cron.schedule('*/10 * * * *', async () => {
  try {
    const now = new Date();

    const appointments = await Appointment.find({ status: 'accepted' });

    let updatedCount = 0;

    for (const appt of appointments) {
      // Create a combined DateTime from the appointment's date and time fields
      const appointmentDateTime = new Date(`${appt.date}T${appt.time}`);

      // Validate date and compare
      if (!isNaN(appointmentDateTime) && appointmentDateTime <= now) {
        appt.status = 'completed';
        await appt.save();
        updatedCount++;
      }
    }

    console.log(
      `[Cron] ${updatedCount} appointment(s) updated to 'completed' at ${now.toLocaleString()}`
    );
  } catch (error) {
    console.error('[Cron Job Error] Failed to update appointment statuses:', error.message);
  }
});
