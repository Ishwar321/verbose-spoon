const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
 doctorId: {
 type: mongoose.Schema.Types.ObjectId,
 ref: 'Doctor',
 required: true
 },
 patientId: {
 type: mongoose.Schema.Types.ObjectId,
 ref: 'Patient',
 required: true
 },
 appointmentType: {
 type: String,
 enum: ['online', 'offline'],
 required: true
 },
 date: {
 type: Date,
 required: true
 },
 time: {
 type: String,
 required: true
 },
 status: {
 type: String,
 enum: ['pending', 'approved', 'rejected'],
 default: 'pending'
 },
 createdAt: {
 type: Date,
 default: Date.now
 }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
