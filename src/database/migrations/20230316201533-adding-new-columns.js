'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('Users', 'gender', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('Users', 'DOB', {
        type: Sequelize.DATE,
        allowNull: true,
      }),
      queryInterface.addColumn('Users', 'prefferedLanguage', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('Users', 'prefferedCurrency', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('Users', 'billingAddress', {
        type: Sequelize.JSONB,
        allowNull: true,
      }),
      queryInterface.addColumn('Users', 'profilePic', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'gender'),
      await queryInterface.removeColumn('Users', 'DOB'),
      await queryInterface.removeColumn('Users', 'prefferedLanguage'),
      await queryInterface.removeColumn('Users', 'prefferedCurrency'),
      await queryInterface.removeColumn('Users', 'billingAddress'),
      await queryInterface.removeColumn('Users', 'profilePic');
  },
};
