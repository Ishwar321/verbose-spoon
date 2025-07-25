// Get doctor profile (for /profile route)
exports.getDoctorProfileController = async (req, res) => {
  try {
    const doctor = await User.findById(req.user.id).select('-password');
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).send({ success: false, message: 'Doctor not found' });
    }
    res.status(200).send({ success: true, data: doctor });
  } catch (error) {
    res.status(500).send({ success: false, message: 'Failed to fetch doctor profile', error: error.message });
  }
};
const User = require('../models/userModels');
const Appointment = require('../models/appointmentModel');
const dayjs = require('dayjs');

// Get all appointments for the logged-in doctor
exports.getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.user.id;
    // FIX: The previous query was causing a TypeError.
    // Mongoose handles string-to-ObjectId casting automatically, so a simple query is sufficient and more robust.
    const appointments = await Appointment.find({ doctorId: doctorId })
      .populate('userId', 'name email')
      .lean();

    // The frontend expects separate date and time fields. We format them here for consistency.
    const formattedAppointments = appointments.map(appt => ({
        ...appt,
        patientName: appt.userId?.name || 'Unknown Patient',
        patientEmail: appt.userId?.email || 'N/A',
        date: appt.date ? dayjs(appt.date).format('YYYY-MM-DD') : null,
        time: appt.date ? dayjs(appt.date).format('HH:mm') : null,
    }));

    res.send({ success: true, appointments: formattedAppointments });
  } catch (error) {
    console.error('getDoctorAppointments error:', error);
    res.status(500).send({ success: false, message: 'Failed to fetch appointments', error: error.message });
  }
};

// Get all patients for the logged-in doctor (unique users with appointments)
exports.getDoctorPatients = async (req, res) => {
  try {
    const doctorId = req.user.id;
    // FIX: The same faulty query was used here. Simplified for correctness.
    const appointments = await Appointment.find({ doctorId: doctorId })
      .populate('userId', 'name email')
      .lean();

    const patientsMap = {};
    appointments.forEach(appt => {
      // Ensure appt.userId exists before accessing its properties and adding to map
      if (appt.userId && appt.userId._id) { // Also check for _id
        if (!patientsMap[appt.userId._id]) {
          patientsMap[appt.userId._id] = {
            _id: appt.userId._id,
            name: appt.userId.name,
            email: appt.userId.email,
            // Add other patient details you might need on the frontend
          };
        }
      }
    });
    const patients = Object.values(patientsMap);
    res.send({ success: true, patients });
  } catch (error) {
    console.error('getDoctorPatients error:', error);
    res.status(500).send({ success: false, message: 'Failed to fetch patients', error: error.message });
  }
};

// Get and set doctor availability (simple in-memory for demo, replace with DB in prod)
// WARNING: This is an in-memory storage. Data will be lost on server restart.
let doctorAvailability = {};

exports.getDoctorAvailability = (req, res) => {
  try {
    const doctorId = req.user.id;
    // Return a copy to avoid external modification issues, and ensure date/time strings
    const currentAvailability = (doctorAvailability[doctorId] || []).map(slot => ({
        date: slot.date, // Assuming date is already YYYY-MM-DD string
        time: slot.time  // Assuming time is already HH:MM string
    }));
    res.send({ success: true, availability: currentAvailability });
  } catch (error) {
    console.error('getDoctorAvailability error:', error);
    res.status(500).send({ success: false, message: 'Failed to fetch availability', error: error.message });
  }
};

exports.setDoctorAvailability = (req, res) => {
  try {
    const doctorId = req.user.id;
    const { availability } = req.body;

    // Basic validation for incoming availability array
    if (!Array.isArray(availability) || !availability.every(item =>
        typeof item === 'object' && item !== null && 'date' in item && 'time' in item
    )) {
      return res.status(400).send({ success: false, message: 'Invalid availability format. Expected an array of objects with date and time.' });
    }

    // Sanitize and store, ensuring consistency
    doctorAvailability[doctorId] = availability.map(slot => ({
        date: String(slot.date),
        time: String(slot.time)
    }));

    res.send({ success: true, availability: doctorAvailability[doctorId] });
  } catch (error) {
    console.error('setDoctorAvailability error:', error);
    res.status(500).send({ success: false, message: 'Failed to set availability', error: error.message });
  }
};

// Update appointment status (e.g., approve, reject)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(id, { status }, { new: true });

    if (!appointment) {
      return res.status(404).send({ success: false, message: 'Appointment not found' });
    }

    res.send({ success: true, message: 'Appointment status updated', appointment });
  } catch (error) {
    console.error('updateAppointmentStatus error:', error);
    res.status(500).send({ success: false, message: 'Failed to update status', error: error.message });
  }
};

