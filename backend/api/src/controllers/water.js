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
const _name:string = 'water';
const _fields:Array<string> = [
  '_id', 'user_id', 'entry_date', 'value', 'createdAt', 'updatedAt',
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
controller.list = WaterController.list(function(req, resources) {
  if (req.token.unit == 'imperial' && resources[0].value) {
    resources = resources.map((resource) => {
      resource.value = _round(convert(resource.value).from('ml')
                        .to('fl-oz'), 0);
      return resource;
    });
  }
  return resources;
});
// Export our controller
module.exports = controller;
