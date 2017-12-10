// @flow
'use strict';
const shortid = require('shortid');
const userUnitObj = {
  imperial: 'imperial',
  metric: 'metric',
};
const {LOGIN_ERROR} = require('../config/lang/user-enUs');
const db = require('../models');
const validator = require('validator');
const jwt = require('../lib/jwt-manager');
const log = require('../../../../libs/logger');
const bcrypt = require('bcrypt');
const userController = {};


// check for unique email (name is misleading)
const _isIdUnique = function(email) {
    return db.user.count({where: {email: email}})
      .then((count) => {
        if (count != 0) {
          return false;
        }
        return true;
    });
};

// Creates a new user if applicable
userController.create = (req: Object, res: Object, next: Function) => {
  let user = {
    _id: shortid(),
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    birthdate: validator.toDate(req.body.birthdate),
    email: req.body.email,
    password: req.body.password,
    height: req.body.height,
    unit: userUnitObj[req.body.unit],
  };

  _isIdUnique(user.email).then((unique) => {
    if (unique) {
      bcrypt.hash(user.password, 10, function(err, hash) {
        // Store hash in your password DB.
        user.password = hash;
        db.user.create(user).then((result) => {
        delete user.password;
        return res.json({
          data: [{
            resource: 'user',
            _id: user._id,
            token: jwt.issue(user),
          }],
        });
      });
    });
    } else {
      return res.status(400).json({errors: [{type: 'exists', dataPath: 'email',
      message: 'Email already in use'}]});
    }
  });
};

// Login Function
userController.login = (req: Object, res: Object, next: Function): Promise => {
  let _reject = (message) => {
    return res.status(401).json({
      errors: [{
        type: 'LoginFailed',
        dataPath: 'user.login',
        message,
      }],
    });
  };
  db.user.findOne({
    where: {
      email: req.body.email,
    },
    plain: true,
  }).then((user) => {
    bcrypt.compare(req.body.password, user.password, (e, valid: Boolean) => {
      // Check for error
      if (e) log.error(e);
      // Remove password hash from return token
      user = user.dataValues;
      delete user.password;
      // valid == true
      if (valid) {
        return res.json({data: [{
          _id: user._id,
          token: jwt.issue(user),
        }]});
      }
      _reject(LOGIN_ERROR);
    });
  }).catch((e) => {
    log.error(e);
    _reject(LOGIN_ERROR);
  });
};

// Cascade delete
userController.delete = (req: Object, res: Object, next: Function) => {
  let where = {where: {_id: req.token._id}};
  Promise.all([
    // db.goal.destroy(where),
    // db.water.destroy(where),
    // db.weight.destroy(where),
    // db.mindfulness.destroy(where),
    // db.sleep.destroy(where),
    db.user.destroy(where),
  ])
  .then((deleted) => {
    if (deleted[0] === 1) {
      return res.status(202).json({
        message: `Deleted user with _id = ${req.token._id}`,
      });
    }
    res.bad()
      .error('FailedDelete', 'user.delete',
      `User with _id = ${req.token._id} not found`)
      .resolve(400);
  })
  .catch((e) => {
    log.error(e);
    return res.bad()
              .error('FailedDelete', 'user.delete', e.message).resolve(400);
  });
};

module.exports = userController;
