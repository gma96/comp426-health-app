'use strict';

var shortid = require('shortid');
var userUnitObj = {
  imperial: 'imperial',
  metric: 'metric'
};
var db = require('../models');
var validator = require('validator');
var jwt = require('../lib/jwt-manager');
var bcrypt = require('bcrypt');
var userController = {};

var _isIdUnique = function _isIdUnique(email) {
  return db.user.count({ where: { email: email } }).then(function (count) {
    if (count != 0) {
      return false;
    }
    return true;
  });
};

userController.create = function (req, res, next) {
  var user = {
    _id: shortid(),
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    birthdate: validator.toDate(req.body.birthdate),
    email: req.body.email,
    password: req.body.password,
    height: req.body.height,
    unit: userUnitObj[req.body.unit]
  };

  _isIdUnique(user.email).then(function (unique) {
    if (unique) {
      bcrypt.hash(user.password, 10, function (err, hash) {
        // Store hash in your password DB.
        user.password = hash;
        db.user.create(user).then(function (result) {
          delete user.password;
          return res.json({
            data: [{
              resource: 'user',
              _id: user._id,
              token: jwt.issue(user)
            }]
          });
        });
      });
    } else {
      return res.status(400).json({ errors: [{ type: 'exists', dataPath: 'email',
          message: 'Email already in use' }] });
    }
  });
};
userController.find = function (req, res, next) {};
userController.delete = function (req, res, next) {};

module.exports = userController;