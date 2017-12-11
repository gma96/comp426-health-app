const GenericResourceError = require('./generic-resource');
module.exports = class FailedDeleteError extends GenericResourceError {
  constructor(dataPath=null, message=null, values=null) {
    super('FailedDeleteError', dataPath, message, values);
    Error.captureStackTrace(this, this.constructor);
  }
};