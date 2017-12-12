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
        var start = new Date(this.get('start_datetime'));
        var end = new Date(this.get('end_datetime'));
        return Math.abs(start - end) / 60000;
      }
    },
    quality: DataTypes.INTEGER,
    notes: DataTypes.STRING(255),
  }, {
    freezeTableName: true,
  });
  return sleep;
};
