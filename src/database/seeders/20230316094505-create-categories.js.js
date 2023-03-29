/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
/* eslint-disable strict */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Categories',
      [
        {
          id: 'a1a96a86-d898-45d2-896f-51898966b896',
          name: 'furniture',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'a1a96a86-d898-45d2-896f-51898966b892',
          name: 'electronics',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'a1a96a86-d898-45d2-896f-51898966b893',
          name: 'shoes',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'a1a96a86-d898-45d2-896f-51898966b894',
          name: 'fruits',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'a1a96a86-d898-45d2-896f-51898966b895',
          name: 'bags',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {},
};