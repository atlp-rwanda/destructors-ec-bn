'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      'Users',
      [
        {
          id: '098a0574-4532-4de9-9ed5-12151d16eb2c',
          firstname: 'admin',
          lastname: 'meadmin',
          email: 'admin@gmail.com',
          password:
            '$2a$10$bGTrd8acp5Ve6YZc4htd2.r24AjMVu44XUEblmqsLYp94dIGju.OC',
          role: 'admin',
          isEmailVerified:true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'd0db925d-03b7-4e7a-a838-7a8d0823fd97',
          firstname: 'seedSeller',
          lastname: 'seedSeller',
          email: 'seed@gmail.com',
          password:
            '$2a$10$bGTrd8acp5Ve6YZc4htd2.r24AjMVu44XUEblmqsLYp94dIGju.OC',
          role: 'seller',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'd0db925d-03b7-4e7a-a838-7a8d0823fd00',
          firstname: 'seedSeller',
          lastname: 'seedSeller',
          email: 'test@gmail.com',
          password:
            '$2a$10$bGTrd8acp5Ve6YZc4htd2.r24AjMVu44XUEblmqsLYp94dIGju.OC',
          role: 'seller',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'd0db925d-03b7-4e7a-a800-7a8d0823fd00',
          firstname: 'seedSeller',
          lastname: 'seedSeller',
          email: 'buyer@gmail.com',
          password:
            '$2a$10$bGTrd8acp5Ve6YZc4htd2.r24AjMVu44XUEblmqsLYp94dIGju.OC',
          role: 'buyer',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      {}
    ),

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete('Users', null, {}),
};





