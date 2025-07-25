// Doctor Controller
exports.applyDoctorController = (req, res) => {
  // Logic to apply as doctor
  res.send({ success: true, message: 'Doctor application submitted' });
};

exports.getAllDoctorsController = (req, res) => {
  // Logic to get all doctors
  res.send({ success: true, doctors: [] });
};

exports.getDoctorByIdController = (req, res) => {
  // Logic to get doctor by ID
  res.send({ success: true, doctor: {} });
};
