module.exports = class RequestError extends Error {
  constructor(code=400, errors=null) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.type = 'RequestError';
    this.code = code;
    switch (code) {
      case 400:
        this.message = 'Bad Request';
        break;
      case 401:
        this.message = 'Unauthorized';
        break;
      case 403:
        this.message = 'Forbidden';
        break;
      case 404:
        this.message = 'Not Found';
        break;
      default:
        break;
    }
    if (errors) {
      this.errors = errors;
    }
  }
};
