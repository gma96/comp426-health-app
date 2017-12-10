'use strict';
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/database')[env];
const db = {};
const log = require('../../../../libs/logger');
let logger = {logging: log.info};
if (env == 'test') logger = {logging: false};
const sequelize = new Sequelize(config.database, config.username,
                                config.password,
                                Object.assign({}, config, logger));

sequelize
.authenticate()
  .then(() => {
  // console.log('Connection has been established successfully.');
  }).catch((err) => {
    // console.log('Unable to connect to the database:', err);
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import Models such that I can use them in the api just by importing 'db'
db.user = require('./user')(sequelize, Sequelize);

module.exports = db;
