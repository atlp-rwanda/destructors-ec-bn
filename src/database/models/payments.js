'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class payments extends Model {
    static associate(models) {
      this.hasOne(models.Orders, { foreignKey: 'paymentId' });
    }
  }
  payments.init(
    {
      cartId: DataTypes.UUID,
      userId: DataTypes.UUID,
      email: DataTypes.STRING,
      cardId: DataTypes.NUMBER,
      amount: DataTypes.NUMBER,
    },
    {
      sequelize,
      modelName: 'payments',
    }
  );
  return payments;
};
