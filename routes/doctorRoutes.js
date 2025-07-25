const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const userModel = require('../models/userModels');
const doctorDataCtrl = require('../controllers/doctorDataCtrl');
const { getDoctorProfileController } = doctorDataCtrl;
const router = express.Router();

// Get doctor profile
router.get('/profile', authMiddleware, getDoctorProfileController);

/**
 * @route   PATCH /api/v1/doctor/updateAppointment/:id
 * @desc    Update appointment status (approve/reject) for a doctor (legacy frontend support)
 */
router.patch('/updateAppointment/:id', authMiddleware, doctorDataCtrl.updateAppointmentStatus);

/**
 * @route   PATCH /api/v1/doctor/appointments/:id/status
 * @desc    Update appointment status (approve/reject) for a doctor
 */
router.patch('/appointments/:id/status', authMiddleware, doctorDataCtrl.updateAppointmentStatus);
/**
 * @route   GET /api/v1/doctor/appointments
 * @desc    Get all appointments for the logged-in doctor
 */
router.get('/appointments', authMiddleware, doctorDataCtrl.getDoctorAppointments);

/**
 * @route   POST /api/v1/doctor/apply-doctor
 * @desc    Apply as a doctor (could be extended for real applications)
 */
router.post('/apply-doctor', authMiddleware, (req, res) => {
  // Simple response for demonstration, extend as needed
  res.send({ success: true, message: 'Doctor application submitted' });
});

/**
 * @route   GET /api/v1/doctor/getAllDoctors
 * @desc    Get all doctors
 */
router.get('/getAllDoctors', authMiddleware, async (req, res) => {
  try {
    const doctors = await userModel.find({ role: 'doctor' });
    res.send({ success: true, doctors });
  } catch (error) {
    res.status(500).send({ success: false, message: 'Failed to fetch doctors', error: error.message });
  }
});

/**
 * @route   GET /api/v1/doctor/:id
 * @desc    Get doctor by ID
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const doctor = await userModel.findOne({ _id: req.params.id, role: 'doctor' });
    if (!doctor) return res.status(404).send({ success: false, message: 'Doctor not found' });
    res.send({ success: true, doctor });
  } catch (error) {
    res.status(500).send({ success: false, message: 'Failed to fetch doctor', error: error.message });
  }
});

module.exports = router;