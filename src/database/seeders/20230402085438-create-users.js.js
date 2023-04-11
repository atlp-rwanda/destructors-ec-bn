'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      'Users',
      [
        {
          id: '098a0574-4532-4de9-9ed5-12151d16eb6c',
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
      ],
      {}
    ),

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete('Users', null, {}),
};





