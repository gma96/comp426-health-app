// @flow
'use strict';
// Import NPM Modules
const db = require('../models');

// converts from any date format to SQL "YYYY-MM-DD HH:MM:SS" format
const _convert = function(timestring) {
  return new Date(timestring).toISOString().slice(0, 19).replace('T', ' ');
};

const controller = {};
const _name:string = 'mindfulness';
const _fields:Array<string> = [
  '_id', 'user_id', 'start_datetime', 'end_datetime', 'activity', 'notes', 'createdAt', 'updatedAt',
];

const Controller = require('../controllers/controller-generic');
const MindfulnessController = new Controller(_name, db[_name], _fields);

// CRUD Operations
// Create Resource
controller.create = MindfulnessController.create({
  uniqueQuery: function(req) {
    return {
      where: {
        start_datetime: {
          $lte: _convert(req.body.end_datetime)
        },
        end_datetime: {
          $gte: _convert(req.body.start_datetime),
        },
      },
    };
  },
  resourceBuilder: function(req) {
    return new Promise((resolve, reject) => {
      // If the times are reversed, then put them in order. // or just reject
      if(new Date(req.body.start_datetime).getTime() > new Date(req.body.end_datetime).getTime()) {
        var temp = req.body.start_datetime;
        req.body.start_datetime = req.body.end_datetime;
        req.body.end_datetime = temp;
      }

      let resource = {};
      resource.user_id = req.token._id;
      resource.start_datetime =_convert(req.body.start_datetime);
      resource.end_datetime = _convert(req.body.end_datetime);
      resource.activity = req.body.activity;
      resource.notes = req.body.notes;
      return resolve(resource);
    });
  },
});

// Read Resource
controller.read = MindfulnessController.read(function(req, resource) {
  return resource;
});

// Update Resource
controller.update = MindfulnessController.update({
  uniqueQuery: function(req) {
    return {
      where: {
        _id: req.params._id,
        user_id: req.token._id,
        start_datetime: {
          $lte: _convert(req.body.end_datetime)
        },
        end_datetime: {
          $gte: _convert(req.body.start_datetime),
        },
      },
    };
  },
  resourceBuilder: function(req, resource) {
    // TODO: idk if this is right
    return resource;
  },
});

// Delete Resource
controller.delete = MindfulnessController.delete();

// Collections Operations
controller.list = MindfulnessController.list({
  queryBuilder: function(req, query) {
    query = Object.assign({}, query);
    if (req.query.date_start || req.query.date_end) {
      if (req.query.date_start) {
        query.where.start_datetime = {};
        query.where.start_datetime['gte'] = _convert(req.query.date_start);
      }
      if (req.query.date_end) {
        query.where.end_datetime = {};
        query.where.end_datetime['lte'] = _convert(req.query.date_end).slice(0, 10) + " 23:59:59";
      }
    }
    return query;
  },
  resourceBuilder: function(req, resources) {
    return resources;
  },
});
// Export our controller
module.exports = controller;
