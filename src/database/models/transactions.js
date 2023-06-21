'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transactions extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'userId', as: 'buyer' });
      this.belongsTo(models.Orders, { foreignKey: 'orderId' });
    }
  }

  Transactions.init(
    {
      orderId: {
        type: DataTypes.UUID,
        references: {
          model: 'Orders',
          key: 'id',
        },
      },
      SerialId: DataTypes.STRING,
      transactionId: DataTypes.STRING,
      status: {
        type: DataTypes.STRING,
        values: ["pending", "completed", "failed"],
      },
      amount: DataTypes.INTEGER,
      userId: {
        type: DataTypes.UUID,
        references: { model: 'User', key: 'id' },
      },
    },
    {
      sequelize,
      modelName: 'Transactions',
    }
  );

  return Transactions;
};
