// src/utils/errors.js
class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.name = this.constructor.name;
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  class UnauthorizedError extends AppError {
    constructor(message = 'Not authorized') {
      super(message, 401);
      this.name = 'UnauthorizedError';
    }
  }
  
  class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
      super(message, 404);
      this.name = 'NotFoundError';
    }
  }
  
  class ValidationError extends AppError {
    constructor(message = 'Validation failed', errors = []) {
      super(message, 400);
      this.name = 'ValidationError';
      this.errors = errors;
    }
  }
  
  module.exports = {
    AppError,
    UnauthorizedError,
    NotFoundError,
    ValidationError
  };