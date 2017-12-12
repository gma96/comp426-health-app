// @flow
'use strict';
// const processes = require('../lib/req-processors');
const shortid = require('shortid');
const processes = require('../lib/req-processors');
const _difference = require('lodash/difference');
// Errors
const RequestError = require('../exceptions/request');
const FailedDeleteError = require('../exceptions/failed-delete');
const ResourceExistsError = require('../exceptions/exists');
const ResourceCreateError = require('../exceptions/create');
const ResourceReadError = require('../exceptions/read');
const ResourceUpdateError = require('../exceptions/update');
const ResourceDeleteError = require('../exceptions/delete');
const ResourceFieldError = require('../exceptions/resource-field');
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

// Standard CRUD
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
        if (result) {
          if (resourceBuilder) {
            return res.build().data(
              resourceBuilder(req, result.dataValues)).resolve();
          }
          return res.build().data(result.dataValues).resolve();
        } else {
          return next(new RequestError(404, [
            new ResourceReadError(
              `${this._name}.read`,
              `Resource with _id = ${req.params._id} doesn't exist`
            ),
          ]));
        }
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

Controller.prototype.update = function(reqBuilder=null) {
  return (req: Object, res: Object, next: Function) => {
    // Values to change
    let resource = Object.assign({}, req.body);
    if (resource._id) delete resource._id;
    if (resource.user_id) delete resource.user_id;

    // Check for differences
    let difference = _difference(Object.keys(resource), this._fields);
    if (difference.length > 0) {
      return next(new RequestError(400, [
        new ResourceUpdateError(
          `${this._name}.update`, 'Invalid fields have been passed'
        ),
        new ResourceFieldError(
          `${this._name}.update`, 'Invalid fields', difference
        ),
      ]));
    }

    let query = {
      where: {
        _id: req.params._id,
        user_id: req.token._id,
      },
      fields: Object.keys(resource), // Fields to update (defaults to all)
    };
    if (reqBuilder) resource = reqBuilder(req, resource);
    this._orm.update(resource, query)
    .then((result) => {
      if (result[0] == 1) return res.sendStatus(202);
      else {
        return next(new RequestError(400, [
          new ResourceUpdateError(
            `${this._name}.update`, `Update failed, result: ${result}`
          ),
        ]));
      }
    })
    .catch((e) => {
      return next(new RequestError(400, [
        new ResourceUpdateError(
          `${this._name}.update`, e.message || 'An error occured :('
        ),
      ]));
    });
  };
};

// Delete
Controller.prototype.delete = function() {
  return (req: Object, res: Object, next: Function) => {
    let query:Object = {
      where: {
        _id: req.params._id,
        user_id: req.token._id,
      },
    };

    // Destroy the Resource
    // Non-cascading destroy
    this._orm.destroy(query)
      .then((result) => {
       if (result[0] === 1) {
          return res.status(202).json({
            message: `Deleted resource with _id = ${req.token._id}`,
          });
        } else {
          return next(new RequestError(404, [
            new ResourceDeleteError(
              `${this._name}.delete`,
              `Resource with _id = ${req.params._id} not found`
            ),
          ]));
        }
      })
      .catch((e) => {
        return next(new RequestError(400, [
          new ResourceDeleteError(
            `${this._name}.delete`, e.message || 'An error occured :('
          ),
        ]));
      });
  };
};


// Collections functions

module.exports = Controller;
