// @flow
'use strict';
// Import NPM Modules
const shortid = require('shortid');
const _difference = require('lodash/difference');
const db = require('../models');
const log = require('../../../../libs/logger');

const _convert = function(v:number):number {
  return v;
};

const controller = {};
const _name:string = 'sleep';
const _fields:Array<string> = [
  '_id', 'user_id', 'start_datetime', 'end_datetime', 'minutes', 'quality', 'notes', 'createdAt', 'updatedAt',
];

const Controller = require('../controllers/controller-generic');
const SleepController = new Controller(_name, db[_name], _fields);

// CRUD Operations
// Create Resource
controller.create = SleepController.create({
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
      resource.user_id = req.token._id;
      resource.start_datetime = req.body.start_datetime;
      resource.end_datetime = req.body.end_datetime;
      resource.minutes = 10; // required false
      resource.quality = req.body.quality; // required false
      resource.notes = req.body.notes; // required false
      return resolve(resource);
    });
  },
});

// Read Resource
controller.read = SleepController.read(function(req, resource) {
  return resource;
});

// Update Resource
controller.update = SleepController.update(function(req, resource) {
  if (req.token.unit == 'imperial' && resource.value) {
    resource.value = _round(convert(resource.value).from('lb')
                        .to('kg'), 3);
  }
  return resource;
});

// Delete Resource
controller.delete = SleepController.delete();

// Collections Operations
controller.list = SleepController.list({
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
