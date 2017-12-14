// @flow
'use strict';
// Import NPM Modules
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const convert = require('convert-units');
// Import local files
const {LOGIN_ERROR} = require('../config/lang/user-enUs'); // Language File
const jwt = require('../lib/jwt-manager');
const db = require('../models');
const log = require('../../../../libs/logger');
const RequestError = require('../exceptions/request');
const FailedDeleteError = require('../exceptions/failed-delete');
const ResourceExistsError = require('../exceptions/exists');
const ResourceReadError = require('../exceptions/read');
const LoginFailedError = require('../exceptions/user-login');
// Unit options map
const userUnitObj = {
  imperial: 'imperial',
  metric: 'metric',
};
// Token Cookie Info
const TOKEN_AGE = 60 * 30;
const TOKEN_NAME = 'token';
const TOKEN_SETTINGS = {
  // secure: true,
  httpOnly: false,
  maxAge: 1000 * TOKEN_AGE,
};

// Add Generic controller support
const _name:string = 'user';
const _fields:Array<string> = [
  '_id', 'first_name', 'last_name', 'birthdate', 'email', 'password', 'height',
  'unit', 'createdAt', 'updatedAt',
];
const Controller = require('../controllers/controller-generic');
const UserController = new Controller(_name, db.user, _fields);

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

const _round = function(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
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

  if (user.unit == 'imperial' && user.height) {
    user.height = _round(convert(user.height).from('in')
                        .to('cm'), 3);
  }

  _isIdUnique(user.email).then((unique) => {
    if (unique) {
      bcrypt.hash(user.password, 10, function(err, hash) {
        // Store hash in your password DB.
        user.password = hash;
        db.user.create(user).then((result) => {
        delete user.password;
        let token = jwt.issue(user, {expiresIn: TOKEN_AGE});
        res.cookie(TOKEN_NAME, token, TOKEN_SETTINGS);
        return res.status(201).json({
          data: [{
            resource: 'user',
            _id: user._id,
            token: token,
          }],
        });
      });
    });
    } else {
      return next(new RequestError(400, [
        new ResourceExistsError('email', 'Email already in use'),
      ]));
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
      if (user.unit == 'imperial' && user.height) {
        user.height = _round(convert(user.height).from('cm')
                            .to('in'), 0);
      }
      return res.build().data(user).resolve(200);
    })
    .catch((e) => {
      return next(new RequestError(400, [
        new ResourceReadError('user.profile', e.message),
      ]));
    });
};


// Update Resource
userController.update = UserController.update({
  queryBuilder: function(req, query) {
    query = Object.assign({}, query);
    delete query.where;
    query.where = {
      _id: req.token._id,
    };
    return query;
  },
  resourceBuilder: function(req, resource) {
    return new Promise((resolve, reject) => {
      let check = resource.unit ? resource.unit : req.token.unit;
      if (check == 'imperial' && resource.height) {
        resource.height = _round(convert(resource.height).from('in')
                            .to('cm'), 3);
      }
      
      if(resource.password) {
        console.log('in bycrypt')
        return bcrypt.hash(resource.password, 10, function(err, hash) {
            // Store hash in your password DB.
            resource.password = hash;
            console.log(resource.password);
            return resolve(resource);
        });
      } else return resolve(resource);
    });
  },
  updateSuccessBeforeSend: function(res, resource) {
    delete resource.password;
    let check = resource.unit ? resource.unit : null;
    if (check == 'imperial' && resource.height) {
      resource.height = _round(convert(resource.height).from('cm')
                          .to('in'), 0);
    }
    let token = jwt.issue(resource, {expiresIn: TOKEN_AGE});
    res.cookie(TOKEN_NAME, token, TOKEN_SETTINGS);
    return res.status(202).json({data: [{token: token}]});
  },
});

// Cascade delete
userController.delete = (req: Object, res: Object, next: Function) => {
  let where = {where: {_id: req.token._id}};
  let subWhere = {where: {user_id: req.token._id}};
  Promise.all([
    db.water.destroy(subWhere),
    db.weight.destroy(subWhere),
    db.mindfulness.destroy(subWhere),
    db.sleep.destroy(subWhere),
    db.user.destroy(where),
  ])
  .then((deleted) => {
    // returns an array of total deleted count for each destroy request
    // therefore we need to get the last item in the deleted array
    // the last item will be the user we deleted
    let userIndex = deleted.length - 1;
    if (deleted[userIndex] === 1) {
      return res.status(202).json({
        message: `Deleted user with _id = ${req.token._id}`,
      });
    }
    return next(new RequestError(404, [
      new FailedDeleteError('user.delete',
        `User with _id = ${req.token._id} not found`),
    ]));
  })
  .catch((e) => {
    log.error(e);
    return next(new RequestError(400, [
      new FailedDeleteError('user.delete', e.message),
    ]));
  });
};

/********************
 * Token Operations *
 ********************/
 // Login Function
userController.login = (req: Object, res: Object, next: Function) => {
  let _reject = (message) => {
    return next(new RequestError(401, [
      new LoginFailedError('user.login', message),
    ]));
  };
  db.user.findOne({
    where: {
      email: req.body.email,
    },
    // attributes: ['_id', 'email', 'unit', 'password'],
  }).then((user) => {
    bcrypt.compare(req.body.password, user.password, (e, valid: Boolean) => {
      // Check for error
      if (e) log.error(e);
      // Remove password hash from return token
      user = user.dataValues;
      delete user.password;
      // valid == true
      if (valid) {
        let token = jwt.issue(user, {expiresIn: TOKEN_AGE});
        res.cookie(TOKEN_NAME, token, TOKEN_SETTINGS);
        return res.build().data({
          _id: user._id,
          token: token,
        }).resolve(200);
      }
      _reject(LOGIN_ERROR);
    });
  }).catch((e) => {
    _reject(LOGIN_ERROR);
  });
};

userController.renew = (req: Object, res: Object, next: Function) => {
  jwt.refreshPreVer(req.token, {}, {expiresIn: TOKEN_AGE})
    .then((refreshed) => {
      res.cookie(TOKEN_NAME, refreshed, TOKEN_SETTINGS);
      res.json({data: [{
        _id: req.token._id,
        token: refreshed,
      }]});
    })
    .catch((e) => {
      return next(new RequestError(400, [e]));
    });
};

userController.verify = (req: Object, res: Object, next: Function) => {
  // Already verified if they made it this far
  res.sendStatus(204);
};

userController.logout = (req: Object, res: Object, next: Function) => {
  // Already verified if they made it this far
  res.clearCookie(TOKEN_NAME);
  res.sendStatus(204);
};

module.exports = userController;
