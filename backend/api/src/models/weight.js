'use strict';
module.exports = (sequelize, DataTypes) => {
  let weight = sequelize.define('weight', {
    _id: {
      type: DataTypes.STRING(14),
      primaryKey: true,
    },
    user_id: DataTypes.STRING(14),
  }, {
    freezeTableName: true,
  });
  return weight;
};
