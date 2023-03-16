const { Model } = require("sequelize");
const { Sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {}
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      firstname: DataTypes.STRING,
      lastname: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: {
        type: DataTypes.STRING,
        defaultValue: "buyer",
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      mustUpdatePassword: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      lastTimePasswordUpdated: DataTypes.DATE,
      location:DataTypes.STRING,
      gender:DataTypes.STRING,
      DOB:DataTypes.DATE,
      currency:DataTypes.STRING,
      billingAddress:DataTypes.JSONB
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
