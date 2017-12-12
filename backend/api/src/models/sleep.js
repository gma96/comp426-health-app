'use strict';
module.exports = (sequelize, DataTypes) => {
  let sleep = sequelize.define('sleep', {
    _id: {
      type: DataTypes.STRING(14),
      primaryKey: true,
    },
    user_id: DataTypes.STRING(14),
    start_datetime: DataTypes.DATE,
    end_datetime: DataTypes.DATE,
    quality: DataTypes.INTEGER,
    notes: DataTypes.STRING(255),
  }, {
    freezeTableName: true,
  });
  return sleep;
};
