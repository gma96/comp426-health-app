const express = require('express');
const osprey = require('osprey');
const join = require('path').join;
const cookieParser = require('cookie-parser'); // Don't think we're going to use
const jwt = require('./lib/jwt-manager');
const middleware426 = require('./lib/res-middleware');
const RequestError = require('./exceptions/request');
// Loggers
const morgan = require('morgan');
const log = require('../../../libs/logger');
const PORT = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'development';

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
        req.token = decoded;
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
  let _hookStart = [];
  const open = function(app, port, c) {
    if (_server) return _server;
    _server = app.listen(PORT, (data) => {
      if (c) c(data, {app, port});
      _hookStart.forEach((f) => {
        f();
      });
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
  const hookStart = function(f: Function): Boolean {
    _hookStart.push(f);
    return true;
  };
  return {
    open,
    get,
    close,
    address,
    hookStart,
  };
})();

osprey.loadFile(apiDir, authHandler).then((middleware) => {
  const router = osprey.Router();
  const app = express();
  if (env !== 'test') app.use(morgan('tiny'));
  app.use(cookieParser());
  app.use(middleware426());
  app.use('/api/v1', middleware, router);

  router.get('/token', handler, (req, res) => {
    res.json(req.decoded);
  });

  // Require Rotes index.js
  require(`${__dirname}/routes`)(router);

  app.use((err, req, res, next) => {
    // log.error(err);
    if (err.type == 'RequestError') {
      return res.status(err.code).json(err);
    }
    if (err && err.ramlAuthorization == true) {
      return res.status(401).json(err);
    }
    if (err) {
      return res.status(400).json(err);
    }
  });

  app.all('*', (req, res) => {
    res.status(404).json({code: 404, message: 'Not Found'});
  });

  server.hookStart(function() {
    if (env !== 'test') log.info('Sever has started hook');
  });

  server.open(app, PORT, (d, v) => {
    if (env !== 'test') log.info(`Mock Server Running on Port: ${v.port}`);
  });
}).catch((e)=> {
  log.error(e);
});

module.exports = server;
