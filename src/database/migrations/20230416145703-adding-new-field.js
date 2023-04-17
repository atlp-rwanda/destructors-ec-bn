'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('Products', 'averageRating', {
        type: Sequelize.DECIMAL,
      }),
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Products', 'averageRating');
  }
};
