'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Blacklist extends Model {
   
    static associate(models) {
      
    }
  }
  Blacklist.init({
    token: DataTypes.CHAR(1500)
  }, {
    sequelize,
    modelName: 'Blacklist',
  });
  return Blacklist;
};