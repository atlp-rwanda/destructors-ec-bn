'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Orders', [
      {
        id: 'd6c01870-10ab-11ec-82a8-0242ac130003',
        paymentId: 'ch_3Jw3GqHrBZ5rtO',
        userId: '59bfed46-6fde-428e-be30-43a957966689',
        email: 'mjbosco2000@gmail.com',
        amount: 2000,
        status: 'paid',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Orders', null, {});
  },
};
