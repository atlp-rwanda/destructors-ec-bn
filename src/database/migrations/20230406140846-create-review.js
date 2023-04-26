'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      buyerId: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      productId: {
        type: Sequelize.UUID,
        references: {
          model: 'Products',
          key: 'id',
        },
      },
      rating: {
        type: Sequelize.INTEGER,
      },
      feedback: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('Reviews');
  },
};
