'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn('Users', 'location', {
        type: Sequelize.STRING,
        allowNull: false
      }),
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([queryInterface.changeColumn('Users', 'localhost')]);
  }
};
