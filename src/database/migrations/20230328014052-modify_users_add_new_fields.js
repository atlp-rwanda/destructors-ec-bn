'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('Users', 'isEmailVerified', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      }),
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'isEmailVerified');
  }
};
