const userController = require('../controllers/user');
module.exports = (router) => {
  router.route('/users')
    .post(userController.create);
  router.route('/users/login')
    .post(userController.login);
  router.route('/users/me')
    .get(userController.read)
    .delete(userController.delete);
  router.route('/users/me/renew')
    .post(userController.renew);
  router.route('/users/me/verify')
    .post(userController.verify);
  router.route('/users/me/logout')
    .post(userController.logout);
};
