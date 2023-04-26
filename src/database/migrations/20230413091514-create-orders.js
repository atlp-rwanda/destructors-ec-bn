'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      paymentId: {
        type: Sequelize.STRING,
      },
      userId: {
        type: Sequelize.UUID,
      },
      email: {
        type: Sequelize.STRING,
      },
      amount: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'payed',
      },
      billingAddress: {
        type: Sequelize.JSONB,
      },
      products: {
        type: Sequelize.ARRAY(Sequelize.JSONB),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
  },
};
