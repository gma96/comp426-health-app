// @flow
'use strict';
// Import NPM Modules
const convert = require('convert-units');
// Custom Modules
const db = require('../models');

const _round = function(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
};

const controller = {};
const _name:string = 'weight';
const _fields:Array<string> = [
  '_id', 'user_id', 'entry_date', 'value', 'createdAt', 'updatedAt',
];

const Controller = require('../controllers/controller-generic');
const WeightController = new Controller(_name, db[_name], _fields);

// CRUD Operations
// Create Resource
controller.create = WeightController.create({
  uniqueQuery: function(req) {
    return {
      where: {
        entry_date: req.body.entry_date,
      },
    };
  },
  resourceBuilder: function(req) {
    return new Promise((resolve, reject) => {
      let resource = {};
      resource.value = req.body.value;
      if (req.token.unit == 'imperial') {
        resource.value = _round(convert(resource.value).from('lb')
                          .to('kg'), 3);
      }
      resource.user_id = req.token._id;
      resource.entry_date = req.body.entry_date;
      return resolve(resource);
    });
  },
});

// Read Resource
controller.read = WeightController.read(function(req, resource) {
  if (req.token.unit == 'imperial' && resource.value) {
    resource.value = _round(convert(resource.value).from('kg').to('lb'), 0);
  }
  return resource;
});

// Update Resource
controller.update = WeightController.update({
  uniqueQuery: function(req) {
    return {
      where: {
        _id: req.params._id,
        user_id: req.token._id,
        entry_date: req.body.entry_date,
      },
    };
  },
  resourceBuilder: function(req, resource) {
    if (req.token.unit == 'imperial' && resource.value) {
      resource.value = _round(convert(resource.value).from('lb')
                          .to('kg'), 3);
    }
    return resource;
  },
});

// Delete Resource
controller.delete = WeightController.delete();

// Collections Operations
controller.list = WeightController.list({
  queryBuilder: function(req, query) {
    query = Object.assign({}, query);
    if (req.query.date_start || req.query.date_end) {
      query.where.entry_date = {};
      if (req.query.date_start) {
        query.where.entry_date['gte'] = req.query.date_start;
      }
      if (req.query.date_end) {
        query.where.entry_date['lte'] = req.query.date_end;
      }
    }
    return query;
  },
  resourceBuilder: function(req, resources) {
    if (req.token.unit == 'imperial' && resources[0].value) {
      resources = resources.map((resource) => {
        resource.value = _round(convert(resource.value).from('kg')
                          .to('lb'), 0);
        return resource;
      });
    }
    return resources;
  },
});
// Export our controller
module.exports = controller;