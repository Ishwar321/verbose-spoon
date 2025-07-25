
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getAllUsersController, getAllDoctorsController, changeAccountStatusController, addDoctorController, removeDoctorController, updateUserController, deleteUserController, getAllAppointmentsController } = require('../controllers/adminCtrl');
const router = express.Router();

// Get all appointments (admin)
router.get('/getAllAppointments', authMiddleware, getAllAppointmentsController);

// Update patient (user)
router.put('/updateUser/:id', authMiddleware, updateUserController);

// Delete patient (user)
router.delete('/deleteUser/:id', authMiddleware, deleteUserController);

// Get all users
router.get('/getAllUsers', authMiddleware, getAllUsersController);

// Get all doctors
router.get('/getAllDoctors', authMiddleware, getAllDoctorsController);

// Change doctor account status
router.post('/changeAccountStatus', authMiddleware, changeAccountStatusController);

// Add doctor
router.post('/addDoctor', authMiddleware, addDoctorController);

// Remove doctor
router.delete('/removeDoctor/:id', authMiddleware, removeDoctorController);

module.exports = router;
