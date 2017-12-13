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
    minutes: {
      type: new DataTypes.VIRTUAL(DataTypes.INTEGER, ['start_datetime', 'end_datetime']),
      get: function() {
        return Math.abs(new Date(this.get('start_datetime')) - new Date(this.get('end_datetime'))) / 60000;
      }
    },
    quality: DataTypes.INTEGER,
    notes: DataTypes.STRING(255),
  }, {
    freezeTableName: true,
  });
  return sleep;
};
