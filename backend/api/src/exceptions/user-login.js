const GenericResourceError = require('./generic-resource');
module.exports = class LoginFailedError extends GenericResourceError {
  constructor(dataPath=null, message=null, values=null) {
    super('LoginFailedError', dataPath, message, values);
    Error.captureStackTrace(this, this.constructor);
  }
};
