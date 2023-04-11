'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sale extends Model {
    static associate(models) {
      // this.belongsTo(models.Order, { foreignKey: 'orderId' });
      this.belongsTo(models.User, { foreignKey: 'sellerId' });
    }
  }
  Sale.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.UUID,
      references: { model: 'Order', key: 'id' },
    },
    sellerId: {
      type: DataTypes.UUID,
      references: { model: 'User', key: 'id' },
    },
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Sale',
  });
  return Sale;
};