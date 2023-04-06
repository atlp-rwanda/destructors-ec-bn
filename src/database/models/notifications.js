'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notifications extends Model {

    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'userId'});
    }
  }
  Notifications.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    notification: DataTypes.STRING,
    userId: {
      type: DataTypes.UUID,
      references: { model: 'User', key: 'id' },
    },
    entityId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Notifications',
  });
  return Notifications;
};