'use strict';
 const {
   Model
 } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductWish extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'userId' });
      this.belongsTo(models.Products, { foreignKey: 'productId', as: 'Product' });
    }
  }
  ProductWish.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        references: { model: 'User', key: 'id' },
      },
      productId: {
        type: DataTypes.UUID,
        references: { model: 'Products', key: 'id' },
      }
    },
    {
      sequelize,
      modelName: 'ProductWish',
    }
  );
  return ProductWish;
};