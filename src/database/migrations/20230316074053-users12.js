'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      // queryInterface.addColumn(
      //   'Users', // table name
      //   'location', // new field name
      //   {
      //     type: Sequelize.STRING,
      //     allowNull: true,
      //   },
      // ),
      // queryInterface.addColumn(
      //   'Users',
      //   'gender',
      //   {
      //     type: Sequelize.STRING,
      //     allowNull: true,
      //   },
      // ),
      queryInterface.addColumn(
        'Users', // table name
        'DOB', // new field name
        {
          type: Sequelize.DATE,
          allowNull: true,
        },
      ),
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      // queryInterface.removeColumn('Users', 'location'),
      queryInterface.removeColumn('Users', 'DOB'),
      // queryInterface.removeColumn('Users', 'gender'),
    ])
  }
};
