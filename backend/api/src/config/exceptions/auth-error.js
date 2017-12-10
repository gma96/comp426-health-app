module.exports = class AuthenticationError extends Error {
  constructor(message, detail) {
  super(detail ? `${message} ${detail}` : message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
  }
};
