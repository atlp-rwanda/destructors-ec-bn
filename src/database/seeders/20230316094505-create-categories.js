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
          id: 'a9a96a11-d898-45d9-896f-11898966b896',
          name: 'furniture',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'a0a96a86-d822-45d0-896f-11898966b892',
          name: 'electronics',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'a8a96a86-d898-45d8-893f-11898966b893',
          name: 'shoes',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'a7a96a86-d898-45d8-894f-11898966b894',
          name: 'fruits',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'a6a16a86-d898-45d8-895f-11898966b895',
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