'use strict';
module.exports = (sequelize, DataTypes) => {
  let water = sequelize.define('water', {
    _id: {
      type: DataTypes.STRING(14),
      primaryKey: true,
    },
    user_id: DataTypes.STRING(14),
    entry_date: DataTypes.DATEONLY,
    value: DataTypes.FLOAT,
  }, {
    freezeTableName: true,
  });
  return water;
};
