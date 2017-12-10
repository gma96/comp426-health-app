// @flow
'use strict';
// Import NPM Modules
const shortid = require('shortid');
const bcrypt = require('bcrypt');
// Import local files
const {LOGIN_ERROR} = require('../config/lang/user-enUs'); // Language File
const jwt = require('../lib/jwt-manager');
const db = require('../models');
const log = require('../../../../libs/logger');
// Unit options map
const userUnitObj = {
  imperial: 'imperial',
  metric: 'metric',
};

// Controller to export
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
    birthdate: req.body.birthdate,
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
        return res.status(201).json({
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

userController.read = (req: Object, res: Object, next: Function) => {
  // Token already verified by middleware
  let token = req.token;
  db.user.findOne({where: {_id: token._id}})
    .then((user) => {
      user = user.dataValues;
      delete user.password;
      return res.build().data(user).resolve(200);
    })
    .catch((e) => {
      return res.build().error('ReadError', 'user.profile', e.message)
              .resolve(400);
    });
};

// Login Function
userController.login = (req: Object, res: Object, next: Function) => {
  let _reject = (message) => {
    return res.bad().error('LoginFailed', 'user.login', message).resolve(401);
  };
  db.user.findOne({
    where: {
      email: req.body.email,
    },
    attributes: ['_id', 'email', 'unit', 'password'],
  }).then((user) => {
    bcrypt.compare(req.body.password, user.password, (e, valid: Boolean) => {
      // Check for error
      if (e) log.error(e);
      // Remove password hash from return token
      user = user.dataValues;
      delete user.password;
      // valid == true
      if (valid) {
        return res.build().data({
          _id: user._id,
          token: jwt.issue(user),
        }).resolve(200);
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
    return res.bad().error('FailedDelete', 'user.delete',
            `User with _id = ${req.token._id} not found`).resolve(404);
  })
  .catch((e) => {
    log.error(e);
    return res.bad().error('FailedDelete', 'user.delete', e.message)
            .resolve(400);
  });
};

module.exports = userController;
