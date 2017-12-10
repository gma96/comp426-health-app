// @flow
module.exports = function() {
  return function(req, res, next) {
    res.bad = function() {
      this.errors = [];
      this.error = (type, dataPath, mesage, o={}) => {
          this.errors.push(Object.assign({type, dataPath, mesage}, o));
          return this;
      };
      this.resolve = (s) => {
          return res.status(s).json({errors: this.errors});
      };
      return this;
    };

    res.build = function() {
      this.errors = [];
      this.dataStore = [];
      this.fields = {};
      this.error = (type, dataPath, mesage, o={}) => {
        this.errors.push(Object.assign({type, dataPath, mesage}, o));
        return this;
      };
      this.data = (o:Object) => {
        this.dataStore.push(o);
        return this;
      };
      this.field = (k:string, v:any) => {
        this.fields[k] = v;
        return this;
      };
      this.resolve = (s) => {
        let r = {};
        if (this.errors.length > 0) r.errors = this.errors;
        if (this.dataStore.length > 0) r.data = this.dataStore;
        return res.status(s).json(Object.assign(r, this.fields));
      };
      return this;
    };
    next();
  };
};
