// @flow
'use strict';
const shortid = require('shortid');
const userUnitObj = {
  imperial: 'imperial',
  metric: 'metric',
};
const db = require('../models');
const validator = require('validator');
const jwt = require('../lib/jwt-manager');
const bcrypt = require('bcrypt');
const userController = {};

const _isIdUnique = function(email) {
    return db.user.count({where: {email: email}})
      .then((count) => {
        if (count != 0) {
          return false;
        }
        return true;
    });
};

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
userController.find = (req: Object, res: Object, next: Function) => {};
userController.delete = (req: Object, res: Object, next: Function) => {};

module.exports = userController;
