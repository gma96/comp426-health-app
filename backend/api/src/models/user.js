module.exports = (sequelize, DataTypes) => {
 let user = sequelize.define('user', {
    _id: {
      type: DataTypes.STRING(14),
      primaryKey: true,
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    birthdate: DataTypes.DATEONLY,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    height: DataTypes.INTEGER,
    unit: DataTypes.ENUM('imperial', 'metric'),
  }, {
    freezeTableName: true,
  });
 return user;
};
