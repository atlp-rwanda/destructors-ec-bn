 
 import request from 'supertest';
 import Sale from "../src/database/models"; 
import  { Orders } from '../src/database/models';
import { Products } from '../src/database/models';
import app from '../src/app';
import {User}from '../src/database/models';
import { generateToken } from '../src/utils/generateToken';
import { Categories } from '../src/database/models';
jest.setTimeout(30000);

describe('sallerUpdateSaleStatus', () => {
    let categories;
    let newseller;
    let sellerToken;
    let products;
    let createSale ;
    beforeAll(async () => {
        categories = await Categories.create({
          name: 'clothers',
        });

             newseller = await User.create({
              firstname: 'fstname',
              lastname: 'sdname',
              email: 'example2@gmail.com',
              password: 'testpass2345',
            });
            await newseller.update({ role: 'seller' });
            // const newSellerToken = generateToken(newseller);
            const user = await User.findOne({ where: { email: 'example2@gmail.com' } });
            // const products = await Products.findAll({});
         products = await Products.create({
                  name: 'Product 1',
                  price: 10,
                  quantity: 5,
                  expiryDate: new Date('2022-01-01'),
                  sellerId: user.id,
                  categoryId: categories.id
                });
                // const newProduct = await Products.findOne({ where: { name: 'Product 1' } });
                const createOrder = await Orders.create({
                    paymentId: "121a0572-4538-4de1-9ed5-62151d16eb6c",
                    userId: "a53998e0-6eb7-4d87-8320-66914b2929a5",
                    email: "divine@gmail.com",
                    amount: 30000,
                    status: "payed",
                    products: [products],
                    });


                    createSale = await Sale.Sale.create({
                        orderId: createOrder.id,
                        sellerId: user.id,
                        status: 'payed',
                    });
        
            // const findOrder = await Orders.findOne({});
                    console.log("***************************:",createSale.id);
      });

      it('should return 401 if the sale is  not related to the current seller', async () => {
        const user = await User.findOne({ where: { email: 'example2@gmail.com' } });
                     sellerToken = generateToken(user);


              const response = await request(app)
              .patch(`/api/v1/sales/${createSale.id}/status`)
              .set('Authorization', `Bearer ${sellerToken}`)
              .send({newStatus:'rejected'})
// const error = await response.body.error
//               console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",error);
        
            expect(response.status).toBe(404);
          });

})

















// let sellerToken
//   jest.setTimeout(30000);

//   const obj =          
//   [{
//   name:"jordan",
//   price:30000,
//   quantity:1,
//   sellerId:"b6d5e15e-7b4e-4dcc-9076-0f13a36d7fe7"
// },
// {
// name:"mangoe",
// price:500,
// quantity:15,
// sellerId:"a53998e0-6eb7-4d87-8320-66914b2929a5"}]



//   beforeAll(async () => {

//     const createUser = await User.User.create({
//         firstname: 'firstname',
//         lastname: 'secondname',
//         email: 'testing@gmail.com',
//         password: 'testpass2345',
//       });


//   const createOrder = await Orders.create({
//     paymentId: "121a0572-4538-4de1-9ed5-62151d16eb6c",
//     userId: "a53998e0-6eb7-4d87-8320-66914b2929a5",
//     email: "divine@gmail.com",
//     amount: 30000,
//     status: "payed",
//     products: JSON.stringify(obj),
//   });

//   const createSale = await Sale.Sale.create({
//     orderId: '121a0572-4538-4de1-9ed5-62151d16eb6c',
//     sellerId: 'd0db925d-03b7-4e7a-a838-7a8d0823fd97',
//     status: 'payed',
//   });
//   console.log("******************************:",createSale);
// });
//   it('should return 401 if the sale is  not related to the current seller', async () => {
//     const newseller = await User.create({
//         firstname: 'fstname',
//         lastname: 'sdname',
//         email: 'testing@gmail.com',
//         password: 'testpass2345',
//       });
//       await newseller.update({ role: 'seller' });
//       const newSellerToken = generateToken(newseller);

// console.log("++++++++++++++++++++++++++:",newseller);
    
//     const sellerPyload = await User.User.findOne({
//         where: { email: 'testing@gmail.com' },
//       });
// //       sellerToken = generateToken(sellerPyload);
// // console.log(sellerPyload);
//       const saleId = await Sale.Sale.findOne({
//         where: { sellerId: 'd0db925d-03b7-4e7a-a838-7a8d0823fd97' },
//       });


//       const response = await request(app)
//       .patch(`/api/v1/sales/${saleId.id}/xstatus`)
//       .set('Authorization', `Bearer ${sellerToken}`);

//     expect(response.status).toBe(404);
//   });

// })