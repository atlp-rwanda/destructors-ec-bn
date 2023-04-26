const { Model } = require('sequelize');
const { Sequelize } = require('.');

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
      gender: DataTypes.STRING,
      DOB: DataTypes.DATE,
      prefferedLanguage: DataTypes.STRING,
      prefferedCurrency: DataTypes.STRING,
      billingAddress: DataTypes.JSONB,
      profilePic: {
        type: DataTypes.STRING,
        defaultValue:
          'https://res.cloudinary.com/ddsml4rsl/image/upload/v1679487348/icons8-male-user-96_vufiae.png',
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: 'buyer',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      mustUpdatePassword: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      lastTimePasswordUpdated: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
      expired: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
