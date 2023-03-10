'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Users', // table name
        'googleId', // new field name
        {
          type: Sequelize.STRING,
          allowNull: false,
        },
      ),
  ])},

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('Users', 'googleId'),
 ])}
};
