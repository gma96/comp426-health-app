'use strict';

var express = require('express');
var osprey = require('osprey');
var join = require('path').join;
var cookieParser = require('cookie-parser'); // Don't think we're going to use
var jwt = require('./lib/jwt-manager');
// Loggers
var morgan = require('morgan');
var log = require('../../../libs/logger');
var PORT = process.env.PORT || 3000;

// API Config
var apiDir = join(__dirname, '../../api.raml');
// Auth Handler
var handler = function handler() {
  return function (req, res, next) {
    var token = null;
    if (req.headers['authorization']) {
      token = req.headers['authorization'].split(/\s+/)[1];
    } else {
      token = req.headers['x-token'];
    }
    jwt.verify(token).then(function (decoded) {
      req.decoded = decoded;
      return next();
    }).catch(function (e) {
      return next(e);
    });
  };
};

// Auth Handler Object
var authHandler = {
  security: {
    jwt: function jwt() {
      return { handler: handler };
    } } };

// Having problems with testing.. needed for mocha, probably not the right way..
var server = function () {
  var _server = null;
  var open = function open(app, port, c) {
    if (_server) return _server;
    _server = app.listen(PORT, function (data) {
      c(data, { app: app, port: port });
    });
  };
  var get = function get() {
    return _server;
  };
  var close = function close(c) {
    c();
    return _server.close();
  };
  var address = function address() {
    return _server.address();
  };
  return {
    open: open,
    get: get,
    close: close,
    address: address
  };
}();

osprey.loadFile(apiDir, authHandler).then(function (middleware) {
  var router = osprey.Router();
  var app = express();
  app.use(morgan('tiny'));
  app.use(cookieParser());
  app.use('/api/v1', middleware, router);

  router.get('/token', handler, function (req, res) {
    res.json(req.decoded);
  });

  // Require Rotes index.js
  require(__dirname + '/routes')(router);

  app.use(function (err, req, res, next) {
    log.error(err);
    if (err && err.ramlAuthorization == true) {
      res.status(401).json(err);
    }
  });

  app.all('*', function (req, res) {
    res.status(404).json({ code: 404, message: 'Not Found' });
  });

  server.open(app, PORT, function (d, v) {
    log.info('Mock Server Running on Port: ' + v.port);
  });
}).catch(function (e) {
  log.error(e);
});

module.exports = server;