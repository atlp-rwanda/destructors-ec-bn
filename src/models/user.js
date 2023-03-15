/**
 * Represents a user in the system.
 * @typedef {Object} User
 * @property {string} id - The unique identifier of the user.
 * @property {string} firstname - The first name of the user.
 * @property {string} lastname - The last name of the user.
 * @property {string} email - The email address of the user.
 * @property {string} password - The password of the user.
 * @property {string} role - The role of the user (buyer or seller).
 * @property {boolean} isActive - Whether the user is active or not.
 * @property {boolean} mustUpdatePassword - Whether the user must update their password or not.
 * @property {Date} lastTimePasswordUpdated - The last time user updated their password.
 */
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  /**
   * Represents the User model in the database.
   * @class User
   * @extends Model
   */
  class User extends Model {
    /**
     * Defines the associations for the User model.
     * @static
     * @param {Object} models - The models object.
     */
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
        defaultValue: 'buyer',
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
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
