const GenericResourceError = require('./generic-resource');
module.exports = class ResourceFieldError extends GenericResourceError {
  constructor(dataPath=null, message=null, values=null) {
    super('ResourceFieldError', dataPath, message, values);
    Error.captureStackTrace(this, this.constructor);
  }
};