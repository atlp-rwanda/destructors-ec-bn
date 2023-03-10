'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  
  static async findOrCreate({ where, defaults }) {
       const [user, created] = await this.findOrCreate({ where, defaults });
        return user;
       }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    googleId:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
// import { Model } from 'sequelize';

// export default (sequelize, DataTypes) => {
//   class User extends Model {
//     static associate(models) {
//       // define association here
//     }

//     

//   User.init({
//     name: DataTypes.STRING,
//     email: DataTypes.STRING,
//     address: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'User',
//   });

//   return User;
// };