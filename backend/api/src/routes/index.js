/**
 * Import All Routes
 */
'use strict';
const Controller = require('../controllers/controller-generic');
module.exports = (router) => {
  // require('./weight')(Routers);
  // require('./water-intake')(Routers);
  // require('./user')(Routers);
  router.get('/users', function (req, res) {
    console.log(req.decoded);
    res.json([
      {
        username: 'blakeembrey',
        password: 'hunter2'
      }
    ])
  })

  // let Test = new Controller('Test', {}, []);
  // router.post('/test', Test.create(function(req) {
  //   return new Promise((resolve, reject) => {
  //     let resource = {};
  //     if (req.token.unit == 'imperial') {
  //       resource.unit = 'Let us convert';
  //     }
  //     resource.hello = req.body.hello;
  //     return resolve(resource);
  //   });
  // }));
  require('./user')(router);
  require('./water')(router);
};
