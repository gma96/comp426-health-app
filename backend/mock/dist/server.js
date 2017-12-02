'use strict';

// Express Stuff
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var PORT = process.env.PORT || 8080;
// Logger
var morgan = require('morgan');
var log = require('../../../libs/logger');

// Mongoose
// const { mongoose } = require('./api/config/Mongoose');
// const User = mongoose.model('Users');

// // Controllers
// const UserController =  require('./api/controllers/UserController');

// App Configuration
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('tiny'));

// The Routers
var routers = function () {
  return {
    authed: express.Router(),
    public: express.Router()
  };
}();

// Install Routers
app.use(routers.public);
// app.use(routers.authed.use(UserController.verify));

// Routes
// require('./api/routes/UserRoutes')(routers);

routers.public.get('/hello', function (req, res) {
  var response = {};
  response.token_decoded = req.decoded;

  var db = {
    '59fa3bcd17db4d042dfab825': [{ some: 'hi' }, { some: 'jkldsjafja' }, { some: 'yo dog' }, { i_love: 'leah dog' }],
    '5a0e66b1b60fa7341c357487': [{ i_love: 'whoever' }, { some: 'data' }, { some: 'data' }, { some: 'data' }]
  };

  // response.data = db[req.decoded._id];
  res.json(db);
});

routers.authed.all('*', function (req, res) {
  res.status(404).json({ message: '404' });
});

// Start Application
module.exports = app.listen(PORT);
log.info('Mock Server Running on Port: ' + PORT);