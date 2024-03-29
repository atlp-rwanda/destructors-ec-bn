/* eslint-disable no-unused-vars */
/* eslint-disable strict */

const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.INTEGER,
      },
      expiryDate: {
        type: Sequelize.DATE,
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      images: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      bonus: {
        type: Sequelize.INTEGER,
      },
      isExpired: {
        type: Sequelize.BOOLEAN,
      },
      isAvailable: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      categoryId: {
        type: Sequelize.UUID,
        references: {
          model: 'Categories',
          key: 'id',
        },
      },
      sellerId: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id',
        },
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
    await queryInterface.dropTable('Products');
  },
};
