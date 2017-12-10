/**
 * Import All Routes
 */
'use strict';

module.exports = function (router) {
  // require('./weight')(Routers);
  // require('./water-intake')(Routers);
  // require('./user')(Routers);
  router.get('/users', function (req, res) {
    console.log(req.decoded);
    res.json([{
      username: 'blakeembrey',
      password: 'hunter2'
    }]);
  });
  require('./user')(router);
};