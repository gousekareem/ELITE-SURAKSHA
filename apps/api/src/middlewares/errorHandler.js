const multer = require('multer');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  if (err instanceof multer.MulterError) {
    statusCode = 400;

    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File size exceeds 5 MB limit';
    }
  }

  const response = {
    success: false,
    message
  };

  if (err.details) {
    response.details = err.details;
  }

  if (process.env.NODE_ENV !== 'production' && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;