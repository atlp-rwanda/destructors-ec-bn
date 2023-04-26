'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mark_Notifications extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'receiverId' });
      this.belongsTo(models.Notifications, { foreignKey: 'notificationId' });
    }
  }
  Mark_Notifications.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      notificationId: {
        type: DataTypes.UUID,
        references: { model: 'Notifications', key: 'id' },
      },
      receiverId: {
        type: DataTypes.UUID,
        references: { model: 'User', key: 'id' },
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Mark_Notifications',
    }
  );
  return Mark_Notifications;
};
