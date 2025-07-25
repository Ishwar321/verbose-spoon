
const Appointment = require('../models/appointmentModel');

// Get all appointments for admin
exports.getAllAppointmentsController = async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate({ path: 'doctorId', select: 'name' })
      .populate({ path: 'userId', select: 'name' });
    // Map to include doctorName and patientName for frontend
    const mapped = appointments.map(appt => ({
      _id: appt._id,
      doctorName: appt.doctorId?.name || '',
      patientName: appt.userId?.name || '',
      date: appt.date,
      time: appt.time,
      status: appt.status,
      ...appt._doc
    }));
    res.send({ success: true, appointments: mapped });
  } catch (error) {
    res.status(500).send({ success: false, message: 'Failed to fetch appointments', error: error.message });
  }
};
// Update patient (user) info
exports.updateUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const user = await userModel.findOneAndUpdate(
      { _id: id, role: 'patient' },
      { name, email },
      { new: true }
    );
    if (!user) return res.status(404).send({ success: false, message: 'Patient not found' });
    res.send({ success: true, message: 'Patient updated successfully', user });
  } catch (error) {
    res.status(500).send({ success: false, message: 'Failed to update patient', error: error.message });
  }
};

// Delete patient (user)
exports.deleteUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userModel.deleteOne({ _id: id, role: 'patient' });
    if (result.deletedCount === 0) return res.status(404).send({ success: false, message: 'Patient not found' });
    res.send({ success: true, message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).send({ success: false, message: 'Failed to delete patient', error: error.message });
  }
};
const userModel = require('../models/userModels');
const bcrypt = require('bcrypt');

// Admin Controller
exports.getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({ role: 'patient' });
    res.send({ success: true, users });
  } catch (error) {
    res.status(500).send({ success: false, message: 'Failed to fetch users', error: error.message });
  }
};

exports.getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await userModel.find({ role: 'doctor' });
    res.send({ success: true, doctors });
  } catch (error) {
    res.status(500).send({ success: false, message: 'Failed to fetch doctors', error: error.message });
  }
};

exports.changeAccountStatusController = (req, res) => {
  // Logic to change doctor account status
  res.send({ success: true, message: 'Account status updated' });
};

exports.addDoctorController = async (req, res) => {
  try {
    const { name, email, specialization, experience } = req.body;
    // Default password for new doctor (should be changed by doctor later)
    const password = await bcrypt.hash('doctor123', 10);
    const existing = await userModel.findOne({ email });
    if (existing) return res.status(400).send({ success: false, message: 'Doctor already exists' });
    const doctor = new userModel({
      name,
      email,
      password,
      role: 'doctor',
      specialization,
      experience,
    });
    await doctor.save();
    res.send({ success: true, message: 'Doctor added successfully' });
  } catch (error) {
    res.status(500).send({ success: false, message: 'Failed to add doctor', error: error.message });
  }
};

exports.removeDoctorController = async (req, res) => {
  try {
    const { id } = req.params;
    await userModel.deleteOne({ _id: id, role: 'doctor' });
    res.send({ success: true, message: 'Doctor removed successfully' });
  } catch (error) {
    res.status(500).send({ success: false, message: 'Failed to remove doctor', error: error.message });
  }
};
