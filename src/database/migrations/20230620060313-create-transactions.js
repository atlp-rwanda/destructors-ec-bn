'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      SerialId: {
        type: Sequelize.STRING
      },
      orderId: {
        type: Sequelize.UUID,
      },
      transactionId: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING,
        values: ['pending', 'completed', 'failed']
      },
      amount: {
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.UUID
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transactions');
  }
};