const userController = require('../controllers/user');
module.exports = (router) => {
  router.route('/users')
    .post(userController.create);
};
