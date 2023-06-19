'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    static associate(models) {
      Orders.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  Orders.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      paymentId: DataTypes.STRING,
      userId: DataTypes.UUID,
      email: DataTypes.STRING,
      amount: DataTypes.INTEGER,
      status: DataTypes.STRING,
      billingAddress: DataTypes.JSONB,
      products: DataTypes.ARRAY(DataTypes.JSONB),
    },
    {
      sequelize,
      modelName: 'Orders',
    }
  );

  return Orders;
};
