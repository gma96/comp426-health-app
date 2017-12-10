'use strict';
module.exports = (sequelize, DataTypes) => {
  let sleep = sequelize.define('sleep', {
    _id: {
      type: DataTypes.STRING(14),
      primaryKey: true,
    },
    user_id: DataTypes.STRING(14),
  }, {
    freezeTableName: true,
  });
  return sleep;
};
