'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ResetPassword extends Model {
    static associate(models) {}
  }
  ResetPassword.init(
    {
      email: DataTypes.STRING,
      token: DataTypes.CHAR(2500),
    },
    {
      sequelize,
      modelName: 'ResetPassword',
    }
  );
  return ResetPassword;
};
