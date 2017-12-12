'use strict';
module.exports = (sequelize, DataTypes) => {
  let weight = sequelize.define('weight', {
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
  return weight;
};
