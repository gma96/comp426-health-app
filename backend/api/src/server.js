const express = require('express');
const osprey = require('osprey');
const join = require('path').join;
const cookieParser = require('cookie-parser'); // Don't think we're going to use
const jwt = require('./lib/jwt-manager');
// Loggers
const morgan = require('morgan');
const log = require('../../../libs/logger');
const PORT = process.env.PORT || 3000;

// API Config
const apiDir = join(__dirname, '../../api.raml');
// Auth Handler
const handler = function() {
  return function(req, res, next) {
    let token = null;
    if (req.headers['authorization']) {
      token = req.headers['authorization'].split(/\s+/)[1];
    } else {
      token = req.headers['x-token'];
    }
    jwt.verify(token)
    .then((decoded) => {
        req.decoded = decoded;
        return next();
    }).catch((e) => {
      return next(e);
    });
  };
};

// Auth Handler Object
const authHandler = {
  security: {
    jwt: function() {
      return {handler: handler};
}}};

// Having problems with testing.. needed for mocha, probably not the right way..
const server = (function() {
  let _server = null;
  const open = function(app, port, c) {
    if (_server) return _server;
    _server = app.listen(PORT, (data) => {
      c(data, {app, port});
    });
  };
  const get = function() {
    return _server;
  };
  const close = function(c) {
    c();
    return _server.close();
  };
  const address = function() {
    return _server.address();
  };
  return {
    open,
    get,
    close,
    address,
  };
})();

osprey.loadFile(apiDir, authHandler).then((middleware) => {
  const router = osprey.Router();
  const app = express();
  app.use(morgan('tiny'));
  app.use(cookieParser());
  app.use('/api/v1', middleware, router);

  router.get('/token', handler, (req, res) => {
    res.json(req.decoded);
  });

  // Require Rotes index.js
  require(`${__dirname}/routes`)(router);

  app.use((err, req, res, next) => {
    log.error(err);
    if (err && err.ramlAuthorization == true) {
      res.status(401).json(err);
    }
  });

  app.all('*', (req, res) => {
    res.status(404).json({code: 404, message: 'Not Found'});
  });

  server.open(app, PORT, (d, v) => {
    log.info(`Mock Server Running on Port: ${v.port}`);
  });
}).catch((e)=> {
  log.error(e);
});

module.exports = server;
