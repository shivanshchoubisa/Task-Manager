const AppError = require('../utils/AppError');

const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Malformed JSON body
  if (err.type === 'entity.parse.failed') {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid JSON in request body' });
  }

  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    message: statusCode === 500 ? 'Internal server error' : err.message,
  };
  if (err.details) response.errors = err.details;

  if (statusCode === 500) console.error(err);

  res.status(statusCode).json(response);
};

module.exports = { notFound, errorHandler };