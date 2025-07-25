const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users', // The patient/user booking the appointment
      required: [true, 'User ID is required'],
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users', // The doctor (who is also a user)
      required: [true, 'Doctor ID is required'],
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
    },
    mode: {
      type: String,
      required: [true, 'Mode is required'],
      enum: ['online', 'offline'],
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'cancelled', 'completed'], // restricts to valid states
      default: 'pending',
    },
  },
  { timestamps: true }
);

const appointmentModel = mongoose.model('appointments', appointmentSchema);
module.exports = appointmentModel;
