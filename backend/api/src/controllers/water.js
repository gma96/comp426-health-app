// @flow
'use strict';
// Import NPM Modules
const shortid = require('shortid');
// Custom Modules
const db = require('../models');
const log = require('../../../../libs/logger');
const processes = require('../lib/req-processors');

const controller = {};
const _name:string = 'water';
const _fields:Array<string> = [
  '_id', 'user_id', 'date', 'value', 'createdAt', 'updatedAt',
];

const _convert = function(v:number):number {
  return v;
};

// TODO
controller.create = (req: Object, res: Object, next: Function) => {
  // Osprey will take care of validating for us
  let resource = {
    _id: shortid(),
  };

  if (req.token.unit == 'imperial') {
    // TODO conversion logic
    // _convert(values.value);
  }

  // Insert into DB
  db[_name].create(resource)
    .then((result) => {
      return res.build().data({
        _id: resource._id,
      }).resolve(201);
    })
    .catch((e) => {
      log.error(e);
      return res.build().error({
        type: 'ResourceCreateError',
        dataPath: `${_name}.create`,
        message: e.message || 'An error occured :(',
      }).resolve(400);
    });
};
// TODO
controller.list = (req: Object, res: Object, next: Function) => {
  // Find in DB
  db[_name].findAll({
    where: {
      user_id: req.token._id,
    },
  })
  .then((result) => {
    return res.build().data(result.dataValues).resolve();
  })
  .catch((e) => {
    log.error(e);
    return res.build().error({
      type: 'ResourceListError',
      dataPath: `${_name}.list`,
      message: e.message || 'An error occured :(',
    }).resolve(400);
  });
};
// TODO
controller.read = (req: Object, res: Object, next: Function) => {
  let query:Object = {
    where: {
      _id: req._id,
    },
  };
  processes.fields(`${_name}.read`, _fields, req.query.fields)
  .then((fields) => {
    if (fields) query.fields = fields;
    // Find in DB
    db[_name].findOne(query)
    .then((result) => {
      return res.build().data(result.dataValues).resolve();
    })
    .catch((e) => {
      log.error(e);
      return res.build().error({
        type: 'ResourceReadError',
        dataPath: `${_name}.read`,
        message: e.message || 'An error occured :(',
      }).resolve(400);
    });
  })
  .catch((e) => {
    return res.build().error(e).resolve(400);
  });
};
// TODO
controller.update = (req: Object, res: Object, next: Function) => {
  // Values to change
  let values = Object.assign({}, req.body);
  if (values._id) delete values._id;
  if (values.user_id) delete values.user_id;

  let options = {
    where: {
      _id: req._id,
    },
    fields: Object.keys(values), // Fields to update (defaults to all)
  };

  if (req.token.unit == 'imperial') {
    // TODO conversion logic
    // _convert(values.value);
  }

  // Find in DB
  db[_name].update(values, options)
  .then((result) => {
    return res.build().data(result.dataValues).resolve();
  })
  .catch((e) => {
    log.error(e);
    return res.build().error({
      type: 'ResourceUpdateError',
      dataPath: `${_name}.update`,
      message: e.message || 'An error occured :(',
    }).resolve(400);
  });
};
// TODO
controller.delete = (req: Object, res: Object, next: Function) => {
  // Find in DB and destroy
  db[_name].destroy({
    where: {
      _id: req._id,
    },
  })
  .then((deleted) => {
    if (deleted[0] === 1) {
      return res.status(202).json({
        message: `Deleted resource with _id = ${req.token._id}`,
      });
    }
    return res.bad().error('ResourceDeleteError', `${_name}.delete`,
            `Resource with _id = ${req.token._id} not found`).resolve(404);
  })
  .catch((e) => {
    log.error(e);
    return res.build().error({
      type: 'ResourceDeleteError',
      dataPath: `${_name}.delete`,
      message: e.message || 'An error occured :(',
    }).resolve(400);
  });
};

// Export our controller
module.exports = controller;
