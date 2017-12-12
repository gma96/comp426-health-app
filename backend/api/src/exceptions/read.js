const GenericResourceError = require('./generic-resource');
module.exports = class ResourceReadError extends GenericResourceError {
  constructor(dataPath=null, message=null, values=null) {
    super('ResourceReadError', dataPath, message, values);
    Error.captureStackTrace(this, this.constructor);
  }
};
