'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    static associate(models) {
      this.belongsTo(models.payments, { foreignKey: 'paymentId' });
      this.belongsTo(models.User, { foreignKey: 'userId' });
      this.hasOne(models.Invoice, { foreignKey: 'orderId' }); // Add association to Invoice model
    }

    // Add hook to automatically create an invoice when an order is created
    static async afterCreate(order) {
      const invoiceData = {
        orderId: order.id,
        buyerId: order.userId,
        orderDetails: order.products,
        buyerDetails: order.User.billingAddress,
        prices: order.products.map((product) => product.price),
        quantities: order.products.map((product) => product.quantity),
      };
      await order.createInvoice(invoiceData);
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
      userId: {
        type: DataTypes.UUID,
        references: { model: 'User', key: 'id' },
      },
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
