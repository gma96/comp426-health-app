const GenericResourceError = require('./generic-resource');
module.exports = class ResourceDeleteError extends GenericResourceError {
  constructor(dataPath=null, message=null, values=null) {
    super('ResourceDeleteError', dataPath, message, values);
    Error.captureStackTrace(this, this.constructor);
  }
};
