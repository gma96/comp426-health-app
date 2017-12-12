// @flow
'use strict';
// const processes = require('../lib/req-processors');
const shortid = require('shortid');
const processes = require('../lib/req-processors');
// Errors
const RequestError = require('../exceptions/request');
const FailedDeleteError = require('../exceptions/failed-delete');
const ResourceExistsError = require('../exceptions/exists');
const ResourceReadError = require('../exceptions/read');
const ResourceCreateError = require('../exceptions/create');
/**
 * creates Generic Controller
 * @return {Controller}
 */
const Controller = function(_name:string, _orm:Object, _fields:?Array<string>) {
  if (!_name) throw new Error('Name Required');
  if (!_orm) throw new Error('ORM Required');
  if (!_fields) throw new Error('Fields Required');
  this._name = _name;
  this._orm = _orm;
  this._fields = _fields || [];
  return this;
};

Controller.prototype.buildResource = function(source, fields, funcs={}) {
  return new Promise((resolve, reject) => {
    if (!source) reject(new Error('Source Required'));
    if (!fields) fields = this._fields;
    let resource = {
      _id: shortid(),
    };
    for (let i = fields.length - 1; i >= 0; i--) {
      let fieldName = fields[i];
      let f = funcs[fieldName];
      let v = source[fieldName];
      if (f) v = f(v);
      resource[fieldName] = v;
    }
    resolve(resource);
  });
};

Controller.prototype.create = function(resourceBuilder) {
  return (req: Object, res: Object, next: Function) => {
    // Osprey will take care of validating for us
    let resource = {
      _id: shortid(),
    };

    resourceBuilder(req)
      .then((builtResource) => {
        // Create Resource
        resource = Object.assign(resource, builtResource);
        // Insert into DB
        this._orm.create(resource)
          .then((result) => {
            return res.build().data({
              _id: resource._id,
            }).resolve(201);
          })
          .catch((e) => {
            return next(new RequestError(400, [
              new ResourceCreateError(`${this._name}.create`,
                e.message || 'An error occured :('
              ),
            ]));
          });
      })
      .catch((e) => {
        e;
      });
  };
};

Controller.prototype.read = function(resourceBuilder=null) {
  return (req: Object, res: Object, next: Function) => {
    let query:Object = {
      where: {
        _id: req.params._id,
        user_id: req.token._id,
      },
    };
    processes.fields(`${this._name}.read`, this._fields, req.query.fields)
    .then((fields) => {
      if (fields) query.attributes = fields;
      // Find in DB
      this._orm.findOne(query)
      .then((result) => {
        if (resourceBuilder) {
          return res.build().data(
            resourceBuilder(req, result.dataValues)).resolve();
        }
        return res.build().data(result.dataValues).resolve();
      })
      .catch((e) => {
        return next(new RequestError(400, [
          new ResourceReadError(`${this._name}.read`,
            e.message || 'An error occured :('
          ),
        ]));
      });
    })
    .catch((e) => {
      return next(e);
    });
  };
};

module.exports = Controller;
