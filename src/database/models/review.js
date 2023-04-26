'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'buyerId', as: 'buyer' });
      this.belongsTo(models.Products, { foreignKey: 'productId' });
    }
  }
  Review.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      buyerId: {
        type: DataTypes.UUID,
        references: { model: 'User', key: 'id' },
      },
      productId: {
        type: DataTypes.UUID,
        references: { model: 'Products', key: 'id' },
      },
      rating: {
        type: DataTypes.NUMBER,
      },
      feedback: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Reviews',
    }
  );
  return Review;
};
