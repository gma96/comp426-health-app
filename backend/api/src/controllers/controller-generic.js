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
const ResourceListError = require('../exceptions/list');
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

Controller.prototype.isUnique = function(query) {
  if (!query) return true;
    return this._orm.count(query)
      .then((count) => {
        if (count != 0) {
          return false;
        }
        return true;
    });
};

// Standard CRUD
Controller.prototype.create = function(o={}) {
  // Probably should make these functions async
  let {uniqueQuery=null, resourceBuilder} = o;
  return (req: Object, res: Object, next: Function) => {
    // Osprey will take care of validating for us
    let resource = {
      _id: shortid(),
    };

    let create = () => {
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
          return next(new RequestError(400, [
            new ResourceCreateError(`${this._name}.create`,
              e.message || 'An error occured building the resource :('
            ),
          ]));
        });
    };
    // Check for Unique
    if (uniqueQuery) {
      this.isUnique(uniqueQuery(req))
      .then((bool) => {
        if (bool) return create();
        return next(new RequestError(400, [
          new ResourceExistsError(this._name, 'Resource exists'),
        ]));
      })
      .catch((e) => {
        e;
      });
    } else create();
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
      this._orm.findAll(query)
      .then((result) => {
        if (result) {
          if (resourceBuilder) {
            return res.build().json({data: resourceBuilder(req, result)});
          } else return res.build().json({data: result});
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

Controller.prototype.update = function(o={}) {
  let {queryBuilder=null, resourceBuilder=null,
    updateSuccessBeforeSend=null, uniqueQuery=null} = o;
  return (req: Object, res: Object, next: Function) => {
    // Values to change
    let resource = Object.assign({}, req.body);
    // Not alllowed to update these fields
    if (resource._id) delete resource._id;
    if (resource.user_id) delete resource.user_id;
    if (resource.createdAt) delete resource.createdAt;
    if (resource.updatedAt) delete resource.updatedAt;

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

    if (queryBuilder) query = queryBuilder(req, query);
    if (resourceBuilder) resource = resourceBuilder(req, resource);
    let update = () => {
      this._orm.update(resource, query)
      .then((result) => {
        if (result[0] == 1) {
          if (updateSuccessBeforeSend) {
            delete query.fields;
            this._orm.findOne(query)
            .then((result) => {
              updateSuccessBeforeSend(res, result.dataValues);
              if (!res.headerSent) return res.sendStatus(202);
              return false;
            })
            .catch((e) => {
              return next(new RequestError(400, [
                new ResourceUpdateError(
                  `${this._name}.update`, e.message,
                ),
              ]));
            });
          } else return res.sendStatus(202);
        } else {
          return next(new RequestError(400, [
            new ResourceUpdateError(
              `${this._name}.update`, `Update failed, result: ${result}`
            ),
          ]));
        }
      })
      .catch((e) => {
        let errors = [
          new ResourceUpdateError(
            `${this._name}.update`, e.message || 'An error occured :('
          ),
        ];
        if (e.errors) {
          errors = errors.concat([].slice.call(e.errors));
        }
        return next(new RequestError(400, errors));
      });
    };

    // Check for Unique
    if (uniqueQuery) {
      this.isUnique(uniqueQuery(req))
      .then((bool) => {
        if (bool) return update();
        return next(new RequestError(400, [
          new ResourceExistsError(this._name, 'Resource exists'),
        ]));
      })
      .catch((e) => {
        e;
      });
    } else update();
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
       // result is not an array
       if (result === 1) {
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


// Collection Operations
Controller.prototype.list = function(o={}) {
  // Probably should make these functions async
  let {queryBuilder=null, resourceBuilder=null} = o;
  return (req: Object, res: Object, next: Function) => {
    let query:Object = {
      where: {
        user_id: req.token._id,
      },
    };
    if (queryBuilder) {
      query = Object.assign({}, queryBuilder(req, query));
    }
    processes.fields(`${this._name}.list`, this._fields, req.query.fields)
    .then((fields) => {
      let pagingQuery = Object.assign({}, query);
      if (fields) pagingQuery.attributes = fields;
      // Find in DB
      this._orm.count(query)
      .then((count) => {
        if (count) {
          // Paging
          let limit = Math.abs(req.query.per_page) || 30;
          let page = Math.abs(req.query.page) || 1;
          let pages = Math.ceil(count / limit);
          let offset = limit * (page - 1);

          if (page > pages) {
            return next(new RequestError(400, [
              new ResourceListError(
                `${this._name}.list`, `Page ${page} out of range, MAX ${pages}`
              )]));
          }

          // Sorting
          let sortField = req.query.sort || 'entry_date';
          let sortDirection = req.query.sort_direction || 'DESC';

          // Build Paging Query
          pagingQuery.limit = limit;
          pagingQuery.offset = offset;
          pagingQuery.order = [[sortField, sortDirection.toUpperCase()]];

          // Execute Query
          this._orm.findAll(pagingQuery)
            .then((result) => {
              let resObject = {
                type: this._name,
                count: count,
                pages: pages,
              };

              // Check for resource builder
              if (resourceBuilder) {
                let entries = resourceBuilder(req, result);
                return res.json(Object.assign({}, resObject, {data: entries}));
              }

              // Return Data if no resourceBuilder Function
              return res.json(Object.assign({}, resObject,
                              {data: result}));
            })
            .catch((e) => {
              return next(new RequestError(400, [
                new ResourceListError(
                  `${this._name}.list`, e.message || 'An error occured :('
                )]));
            });
        } else {
          return next(new RequestError(404, [
            new ResourceListError(
              `${this._name}.list`, 'No resources found'
            ),
          ]));
        }
      })
      .catch((e) => {
        return next(new RequestError(400, [
          new ResourceListError(
            `${this._name}.list`, e.message || 'An error occured :('
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
