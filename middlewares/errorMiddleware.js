// Error handling middleware
module.exports = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong', error: err.message });
};
