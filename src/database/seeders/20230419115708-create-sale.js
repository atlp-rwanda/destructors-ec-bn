'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Sales',
      [
        {
          id: 'd6c01870-10ab-11ec-82a8-0242ac130003',
          orderId: 'd6c01870-10ab-11ec-82a8-0242ac130003',
          sellerId: 'f6053eb8-247e-4964-aae4-147f90a4fd64',
          status: 'paid',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Sales', null, {});
  },
};
