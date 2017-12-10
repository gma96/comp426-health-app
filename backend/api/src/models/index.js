'use strict';
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/database')[env];
const db = {};
const log = require('../../../../libs/logger');
let logger = {logging: false};
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
db.water = require('./water')(sequelize, Sequelize);
db.weight = require('./weight')(sequelize, Sequelize);
db.goal = require('./goal')(sequelize, Sequelize);
db.mindfulness = require('./mindfulness')(sequelize, Sequelize);
db.sleep = require('./sleep')(sequelize, Sequelize);

// Associations
// @see http://docs.sequelizejs.com/manual/tutorial/models-usage.html
let _foreignKey = {foreignKey: 'user_id'};
// water association
db.water.belongsTo(db.user, _foreignKey);
db.user.hasMany(db.water, _foreignKey);
// weight association
db.weight.belongsTo(db.user, _foreignKey);
db.user.hasMany(db.weight, _foreignKey);
// goal association
db.goal.belongsTo(db.user, _foreignKey);
db.user.hasMany(db.goal, _foreignKey);
// mindfulness association
db.mindfulness.belongsTo(db.user, _foreignKey);
db.user.hasMany(db.mindfulness, _foreignKey);
// sleep association
db.sleep.belongsTo(db.user, _foreignKey);
db.user.hasMany(db.sleep, _foreignKey);


module.exports = db;
