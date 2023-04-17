'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Orders.init({
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
    billingAddress:DataTypes.JSONB,
    products: DataTypes.ARRAY(DataTypes.JSONB),
  }, {
    sequelize,
    modelName: 'Orders',
  });
  return Orders;
};