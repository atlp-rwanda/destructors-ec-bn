'use strict';


/** @type {import('sequelize-cli').Migration} */
const obj =          
  [{
  name:"jordan",
  price:30000,
  quantity:1,
  sellerId:"b6d5e15e-7b4e-4dcc-9076-0f13a36d7fe7"
},
{
name:"mangoe",
price:500,
quantity:15,
sellerId:"a53998e0-6eb7-4d87-8320-66914b2929a5"}]
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Orders",
      [
        {
          id: "121a0572-4538-4de1-9ed5-62151d16eb6c",
          paymentId: "121a0572-4538-4de1-9ed5-62151d16eb6c",
          userId: "a53998e0-6eb7-4d87-8320-66914b2929a5",
          email: "divine@gmail.com",
          amount: 30000,
          status: "payed",
          products: JSON.stringify(obj),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Orders", null, {});
  },
};
