const GenericResourceError = require('./generic-resource');
module.exports = class ResourceExistsError extends GenericResourceError {
  constructor(dataPath=null, message=null, values=null) {
    super('ResourceExistsError', dataPath, message, values);
    Error.captureStackTrace(this, this.constructor);
  }
};