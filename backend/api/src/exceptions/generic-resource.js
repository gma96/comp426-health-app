module.exports = class GenericResourceError extends Error {
  constructor(type='ResourceError', dataPath=null, message=null, values=null) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.type = type;
    if (dataPath) {
      this.dataPath = dataPath;
    }
    if (message) {
      this.message = message;
    }
    if (values) {
      this.values = values;
    }
  }
};
