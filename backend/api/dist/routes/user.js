'use strict';

var userController = require('../controllers/user');
module.exports = function (router) {
  router.route('/users').post(userController.create);
};