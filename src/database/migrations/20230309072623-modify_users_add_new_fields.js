'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Users', // table name
        'address', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'Users',
        'linkedin',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
    ]);
  
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('Users', 'linkedin'),
      queryInterface.removeColumn('Users', 'twitter'),
      queryInterface.removeColumn('Users', 'bio'),
    ]);
  }
};
