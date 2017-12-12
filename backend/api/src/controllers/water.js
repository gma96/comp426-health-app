// @flow
'use strict';
// Import NPM Modules
const shortid = require('shortid');
const convert = require('convert-units');
// Custom Modules
const db = require('../models');
const log = require('../../../../libs/logger');

const _round = function(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
};

const controller = {};
const _name:string = 'water';
const _fields:Array<string> = [
  '_id', 'user_id', 'date', 'value', 'createdAt', 'updatedAt',
];

const Controller = require('../controllers/controller-generic');
const WaterController = new Controller(_name, db.water, _fields);

// CRUD Operations
// Create Resource
controller.create = WaterController.create(function(req) {
  return new Promise((resolve, reject) => {
    let resource = {};
    resource.value = req.body.value;
    if (req.token.unit == 'imperial') {
      resource.value = _round(convert(resource.value).from('fl-oz')
                        .to('ml'), 3);
    }
    resource.user_id = req.token._id;
    resource.entry_date = req.body.entry_date;
    return resolve(resource);
  });
});

// Read Resource
controller.read = WaterController.read(function(req, resource) {
  if (req.token.unit == 'imperial' && resource.value) {
    resource.value = _round(convert(resource.value).from('ml').to('fl-oz'), 0);
  }
  return resource;
});

// Update Resource
controller.update = WaterController.update(function(req, resource) {
  if (req.token.unit == 'imperial' && resource.value) {
    resource.value = _round(convert(resource.value).from('fl-oz')
                        .to('ml'), 3);
  }
  return resource;
});

// Delete Resource
controller.delete = WaterController.delete();

// Collections Operations
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
// Export our controller
module.exports = controller;
