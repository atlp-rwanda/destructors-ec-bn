'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      'Users',
      [
        {
          id: '008a0574-4538-4de1-9ed5-62151d16eb6c',
          firstname: 'admin',
          lastname: 'meadmin',
          email: 'admin@gmail.com',
          password:
            '$2a$10$bGTrd8acp5Ve6YZc4htd2.r24AjMVu44XUEblmqsLYp94dIGju.OC',
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    ),

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete('Users', null, {}),
};
