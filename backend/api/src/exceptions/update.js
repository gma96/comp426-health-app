const GenericResourceError = require('./generic-resource');
module.exports = class ResourceUpdateError extends GenericResourceError {
  constructor(dataPath=null, message=null, values=null) {
    super('ResourceUpdateError', dataPath, message, values);
    Error.captureStackTrace(this, this.constructor);
  }
};
