const errorHandler = (err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({ success: false, errorMessage: err.message });
};

module.exports = { errorHandler };