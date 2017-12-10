'use strict';

var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/database')[env];
var db = {};
var log = require('../../../../libs/logger');
var logger = { logging: log.info };
if (env == 'test') logger = { logging: false };
var sequelize = new Sequelize(config.database, config.username, config.password, Object.assign({}, config, logger));

sequelize.authenticate().then(function () {
  // console.log('Connection has been established successfully.');
}).catch(function (err) {
  // console.log('Unable to connect to the database:', err);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import Models such that I can use them in the api just by importing 'db'
db.user = require('./user')(sequelize, Sequelize);

module.exports = db;