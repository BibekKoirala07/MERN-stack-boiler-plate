const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    statusCode: statusCode,
    error: err.message || "Something went wrong!",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = errorHandler;
