'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('Users', 'provider', {
        type: Sequelize.STRING
      }),
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'provider');
  }
};
