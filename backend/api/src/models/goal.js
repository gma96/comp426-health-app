'use strict';
module.exports = (sequelize, DataTypes) => {
  let goal = sequelize.define('goal', {
    _id: {
      type: DataTypes.STRING(14),
      primaryKey: true,
    },
    user_id: DataTypes.STRING(14),
  }, {
    freezeTableName: true,
  });
  return goal;
};
