const GenericResourceError = require('./generic-resource');
module.exports = class ResourceListError extends GenericResourceError {
  constructor(dataPath=null, message=null, values=null) {
    super('ResourceListError', dataPath, message, values);
    Error.captureStackTrace(this, this.constructor);
  }
};
