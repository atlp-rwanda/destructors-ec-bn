/* eslint-disable require-jsdoc */
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Sale extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'sellerId', as: 'Seller' });
      this.belongsTo(models.Orders, { foreignKey: 'orderId', as: 'order' });
    }
  }
  Sale.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      orderId: {
        type: DataTypes.UUID,
        references: {
          model: 'Orders',
          key: 'id',
        },
      },
      sellerId: {
        type: DataTypes.UUID,
        references: { model: 'User', key: 'id' },
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'payed',
      },
    },
    {
      sequelize,
      modelName: 'Sales',
    }
  );
  return Sale;
};
