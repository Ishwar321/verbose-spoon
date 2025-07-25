
const express = require('express');
const { loginController, registerController, authController, getProfileController } = require('../controllers/userCtrl');
const { getUserAppointments, bookAppointment } = require('../controllers/appointmentCtrl');
const { getAllDoctorsController } = require('../controllers/doctorCtrl');
const authMiddleware = require('../middlewares/authMiddleware');
//router object
const router = express.Router();
// Get user profile
router.get('/profile', authMiddleware, getProfileController);

//routes
//LOGIN || POST 
router.post('/login',loginController)
//register || POST
router.post('/register',registerController)
//Auth || POST
router.post('/getUserData',authMiddleware,authController)
// Get user appointments
router.get('/appointments', authMiddleware, getUserAppointments);
// Book appointment
router.post('/book-appointment', authMiddleware, bookAppointment);
// Get all doctors (for patient side)
router.get('/getAllDoctors', authMiddleware, getAllDoctorsController);

module.exports=router