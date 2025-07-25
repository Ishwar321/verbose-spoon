const Appointment = require('../models/appointmentModel');
const userModel = require('../models/userModels');

// Get all appointments for the logged-in user (patient)
const getUserAppointments = async (req, res) => {
  try {
    const userId = req.user && (req.user.id || req.user._id) ? (req.user.id || req.user._id) : null;
    const appointments = await Appointment.find({ userId });
    // Optionally populate doctor info
    const result = await Promise.all(appointments.map(async (appt) => {
      const doctor = await userModel.findById(appt.doctorId);
      return {
        ...appt._doc,
        doctorName: doctor ? doctor.name : 'Doctor',
        specialization: doctor ? doctor.specialization : '',
        time: appt.date ? new Date(appt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        date: appt.date ? new Date(appt.date).toLocaleDateString() : '',
      };
    }));
    res.status(200).send({ success: true, appointments: result });
  } catch (error) {
    console.error('getUserAppointments error:', error);
    res.status(500).send({ success: false, message: 'Failed to fetch appointments', error: error.message });
  }
};

// Book a new appointment
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, mode } = req.body;
    const userId = req.user && (req.user.id || req.user._id) ? (req.user.id || req.user._id) : null;
    if (!doctorId || !date || !time || !mode) {
      return res.status(400).send({ success: false, message: 'All fields are required.' });
    }
    // Validate doctorId is a valid ObjectId string
    if (!doctorId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send({ success: false, message: 'Invalid doctorId.' });
    }
    // Save date and time as separate string fields, matching the model
    const newAppointment = new Appointment({
      userId,
      doctorId,
      date,
      time,
      status: 'pending',
      mode,
    });
    await newAppointment.save();
    res.status(201).send({ success: true, message: 'Appointment booked successfully.' });
  } catch (error) {
    console.error('bookAppointment error:', error);
    res.status(500).send({ success: false, message: 'Failed to book appointment', error: error.message });
  }
};

// Apply for appointment (from ApplyDoctor page)
const applyDoctorAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, mode, status } = req.body;
    const userId = req.user && (req.user.id || req.user._id) ? (req.user.id || req.user._id) : null;
    if (!doctorId || !date || !time || !mode) {
      return res.status(400).send({ success: false, message: 'All fields are required.' });
    }
    // Save date and time as separate string fields, matching the model
    if (!date || !time) {
      return res.status(400).send({ success: false, message: 'Date and time are required.' });
    }
    const newAppointment = new Appointment({
      userId,
      doctorId,
      date,
      time,
      status: status || 'pending',
      mode,
    });
    await newAppointment.save();
    res.status(201).send({ success: true, message: 'Appointment application submitted successfully.' });
  } catch (error) {
    console.error('applyDoctorAppointment error:', error);
    res.status(500).send({ success: false, message: 'Failed to apply for appointment', error: error.message });
  }
};

// Get all appointments for the logged-in doctor
const getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.user && req.user._id ? req.user._id : null;
    if (!doctorId) {
      return res.status(401).send({ success: false, message: 'Unauthorized' });
    }
    const appointments = await Appointment.find({ doctorId });
    // Optionally populate patient info
    const result = await Promise.all(appointments.map(async (appt) => {
      const patient = await userModel.findById(appt.userId);
      return {
        ...appt._doc,
        patientName: patient ? patient.name : 'Patient',
        patientEmail: patient ? patient.email : '',
      };
    }));
    res.status(200).send({ success: true, appointments: result });
  } catch (error) {
    console.error('getDoctorAppointments error:', error);
    res.status(500).send({ success: false, message: 'Failed to fetch doctor appointments', error: error.message });
  }
};

// Update appointment status (approve/reject/complete)
const updateAppointmentStatus = async (req, res) => {
  try {
    const doctorId = req.user && req.user._id ? req.user._id : null;
    const { id } = req.params;
    const { status } = req.body;
    if (!doctorId) {
      return res.status(401).send({ success: false, message: 'Unauthorized' });
    }
    if (!id || !status) {
      return res.status(400).send({ success: false, message: 'Appointment id and status are required.' });
    }
    const appointment = await Appointment.findOne({ _id: id, doctorId });
    if (!appointment) {
      return res.status(404).send({ success: false, message: 'Appointment not found.' });
    }
    appointment.status = status;
    await appointment.save();
    res.status(200).send({ success: true, message: 'Appointment status updated.' });
  } catch (error) {
    console.error('updateAppointmentStatus error:', error);
    res.status(500).send({ success: false, message: 'Failed to update appointment status', error: error.message });
  }
};

module.exports = {
  getUserAppointments,
  bookAppointment,
  applyDoctorAppointment,
  getDoctorAppointments,
  updateAppointmentStatus,
};
