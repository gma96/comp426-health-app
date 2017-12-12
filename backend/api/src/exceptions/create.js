const GenericResourceError = require('./generic-resource');
module.exports = class ResourceCreateError extends GenericResourceError {
  constructor(dataPath=null, message=null, values=null) {
    super('ResourceCreateError', dataPath, message, values);
    Error.captureStackTrace(this, this.constructor);
  }
};
