const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: 'pending',
  },
});

module.exports = mongoose.model('Doctor', doctorSchema);
