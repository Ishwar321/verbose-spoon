const Appointment = require('../models/Appointment');

exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, patientId, appointmentType, date, time } = req.body;

    // Create a new appointment
    const appointment = new Appointment({
      doctorId,
      patientId,
      appointmentType,
      date,
      time
    });

    // Save the appointment to the database
    await appointment.save();

    res.status(201).json({ message: 'Appointment created successfully', appointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create appointment' });
  }
};