class ErrorResponse extends Error {
  constructor(message, statusCode, option) {
    super(message);
    this.statusCode = statusCode;
    if (option && option.name) this[option.name] = option.error;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorResponse;
