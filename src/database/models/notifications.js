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
    message: DataTypes.STRING,
    entityId: DataTypes.JSONB,
    receiverId: DataTypes.UUID,
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Notifications',
  });
  return Notifications;
};