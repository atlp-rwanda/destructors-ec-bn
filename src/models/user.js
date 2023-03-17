const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {}

    async updatePassword(newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      this.password = hashedPassword;
      this.mustUpdatePassword = false;
      this.lastTimePasswordUpdated = new Date();
      await this.save();
    }
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
