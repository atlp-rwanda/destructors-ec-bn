'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notifications extends Model {

    static associate(models) {
     
    }
  }
  Notifications.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    subject: DataTypes.STRING,
    message: DataTypes.JSONB,
    entityId: DataTypes.JSONB,
    receiver: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Notifications',
  });
  return Notifications;
};