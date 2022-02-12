const routeNotFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    errorMessage: "The requested URL doesn't exist on this server :(",
  });
};

module.exports = { routeNotFound };