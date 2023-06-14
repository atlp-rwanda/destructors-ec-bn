'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    static associate(models) {
      this.belongsTo(models.Orders, { foreignKey: 'orderId' });
    }
  }
  Invoice.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      invoiceNumber: DataTypes.STRING,
      orderId: DataTypes.UUID,
      buyerId: DataTypes.UUID,
      orderDetails: DataTypes.JSONB,
      buyerDetails: DataTypes.JSONB,
      prices: DataTypes.JSONB,
      quantities: DataTypes.JSONB,
    },
    {
      sequelize,
      modelName: 'Invoice',
    }
  );
  return Invoice;
};
