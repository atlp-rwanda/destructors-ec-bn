'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      'Sales',
      [
        {
          id: '128a0571-4538-4de1-9ed5-62151d16eb6c',
          orderId: '121a0572-4538-4de1-9ed5-62151d16eb6c',
          sellerId: 'a53998e0-6eb7-4d87-8320-66914b2929a5',
          status: 'payed',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    ),
  

   down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete('Users', null, {}),
  
};
