/* eslint-disable require-jsdoc */
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'sellerId', as: 'Seller' });
      this.belongsTo(models.Categories, { foreignKey: 'categoryId' });
    }
  }
  Product.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      price: DataTypes.NUMBER,
      quantity: DataTypes.INTEGER,
      isAvailable: { type: DataTypes.BOOLEAN, defaultValue: false },
      categoryId: {
        type: DataTypes.INTEGER,
        references: { model: 'Categories', key: 'id' },
      },
      sellerId: {
        type: DataTypes.INTEGER,
        references: { model: 'User', key: 'id' },
      },
      bonus: DataTypes.NUMBER,
      images: DataTypes.ARRAY(DataTypes.STRING),
      expiryDate: DataTypes.DATE,
      averageRating:DataTypes.DECIMAL,
      isExpired: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Products',
    }
  );
  return Product;
};
