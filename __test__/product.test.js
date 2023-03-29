import request from 'supertest';
import app from '../src/app';
import path from 'path';

const { User,Products } = require('../src/database/models');
import { Categories } from '../src/database/models';
import { generateToken } from '../src/utils/generateToken';
// import {Products } from '../src/database/models';
// import User from "../src/database/models"
jest.setTimeout(50000);
describe('Testing Products service', () => {
  let categories;
  beforeAll(async () => {
    categories = await Categories.create({
      name: 'clothers',
    });
  });
  let token = '';
  let sellerToken = '';
  let email = 'testemail123456@gmail.com';

  test('should return 401 when user is not logged in', async () => {
    const response = await request(app).post('/api/v1/products').send({
      name: 'two people sofa',
      price: 5000,
      categoryId: '1a2ef741-1488-4435-b2e2-4075a6a169eb',
    });
    expect(response.statusCode).toBe(401);
  });
  test('it should return 200 when user it signed up', async () => {
    const response = await request(app).post('/api/v1/users/signup').send({
      firstname: 'myfirstname',
      lastname: 'mysecondname',
      email: email,
      password: 'testpass2345',
    });
    token = await response.body.token;
    expect(response.statusCode).toBe(201);
    expect(token).not.toBeNull();
  });
  test('it should return 401 when user is not seller', async () => {
    const response = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'two people sofa',
        price: 5000,
        categoryId: '1a2ef741-1488-4435-b2e2-4075a6a169eb',
      });
    expect(response.statusCode).toBe(401);
  });

  test('it should return 201 for post product when user is seller', async () => {
    const user = await User.findOne({ where: { email: email } });
    await user.update({ role: 'seller' });
    sellerToken = generateToken(user);
    const response = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${sellerToken}`)
      .field('name', 'two people sofa')
      .field('price', 5000)
      .field('categoryId', categories.id)
      .attach('image', path.resolve(__dirname, './images/image.jpg'))
      .attach('image', path.resolve(__dirname, './images/image1.jpg'));
    expect(response.statusCode).toBe(201);
    expect(sellerToken).not.toBeNull();
    expect(response.body.message).toStrictEqual('Products created successfull');
  });
  test('it should return 404 for invalid categories', async () => {
    const response = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${sellerToken}`)
      .field('name', 'two people sofa')
      .field('price', 5000)
      .field('categoryId', '1a2ef741-1488-4435-b2e2-4075a6a169eb')
      .attach('image', path.resolve(__dirname, './images/image.jpg'))
      .attach('image', path.resolve(__dirname, './images/image1.jpg'));
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toStrictEqual('Category doesnt exist');
  });
  test('it should return 404 for product which is already exist', async () => {
    const response = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${sellerToken}`)
      .field('name', 'two people sofa')
      .field('price', 5000)
      .field('categoryId', categories.id)
      .attach('image', path.resolve(__dirname, './images/image.jpg'))
      .attach('image', path.resolve(__dirname, './images/image1.jpg'));
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toStrictEqual(
      'Product is already exist, Please the update the stock instead'
    );
  });
  test('it should return 200 for retrieving list of all products which are available', async () => {
    const response = await request(app)
      .get('/api/v1/products')
      .set('Authorization', `Bearer ${sellerToken}`)
    expect(response.statusCode).toBe(200);
  });
  test('it should return 200 for retrieving list of all products which are in collection of seller', async () => {
    const response = await request(app)
      .get('/api/v1/products')
      .set('Authorization', `Bearer ${sellerToken}`)
    expect(response.statusCode).toBe(200);
  });
  test('it should return 200 for retrieving list of all products which are available', async () => {
    await User.create({
      firstname: 'firstname',
      lastname: 'secondname',
      email: 'example@gmail.com',
      password: 'testpass2345',
    })
   const user = await User.findOne({ where:{email: 'example@gmail.com'}})
    token = generateToken(user)
    const response = await request(app)
      .get('/api/v1/products')
      .set('Authorization', `Bearer ${token}`)
    expect(response.statusCode).toBe(200);
  });
  test('it should return 200 for retrieving  a product', async () => {
   const item = await Products.findOne({ where:{name: 'two people sofa'}})
    const response = await request(app)
      .get(`/api/v1/products/${item.id}`)
      .set('Authorization', `Bearer ${token}`)
    expect(response.statusCode).toBe(200);
  });
  test('it should return 200 for retrieving  a product in seller collection', async () => {
    const item = await Products.findOne({ where:{name: 'two people sofa'}})
     const response = await request(app)
       .get(`/api/v1/products/${item.id}`)
       .set('Authorization', `Bearer ${sellerToken}`)
     expect(response.statusCode).toBe(200);
   });
   test('it should return 404 if there are no product in store', async () => {
    const newseller = await User.create({
      firstname: 'fstname',
      lastname: 'sdname',
      email: 'example23@gmail.com',
      password: 'testpass2345',
    })
   const newSellerToken = generateToken(newseller)
     const response = await request(app)
       .get(`/api/v1/products/1a2ef741-1488-4435-b2e2-4075a6a169eb`)
       .set('Authorization', `Bearer ${newSellerToken}`)
     expect(response.statusCode).toBe(404);
   });
   test('it should return 200 if there are no product in seller collection', async () => {
    const newseller = await User.create({
      firstname: 'fstname',
      lastname: 'sdname',
      email: 'example2@gmail.com',
      password: 'testpass2345',
    })
    await newseller.update({ role: 'seller' });
   const newSellerToken = generateToken(newseller)
     const response = await request(app)
       .get(`/api/v1/products`)
       .set('Authorization', `Bearer ${newSellerToken}`)
     expect(response.statusCode).toBe(200);
   });
   test('it should return 404 if the product is not found in seller collection', async () => {
    const newseller = await User.create({
      firstname: 'fstname',
      lastname: 'sdname',
      email: 'example25@gmail.com',
      password: 'testpass2345',
    })
    await newseller.update({ role: 'seller' });
   const newSellerToken = generateToken(newseller)
     const response = await request(app)
       .get(`/api/v1/products/1a2ef741-1488-4435-b2e2-4075a6a169eb`)
       .set('Authorization', `Bearer ${newSellerToken}`)
     expect(response.statusCode).toBe(404);
   });
   test('it should return 500 if the id provided is invalid', async () => {
    const newseller = await User.findOne({ where:{email: 'example25@gmail.com'}})
   const newSellerToken = generateToken(newseller)
     const response = await request(app)
       .get(`/api/v1/products/1a2ef741-1488-4435-b2e2-4075a6a169`)
       .set('Authorization', `Bearer ${newSellerToken}`)
     expect(response.statusCode).toBe(500);
   });
   test('it should return 200 if there are no products in store', async () => {
   const user = await User.findOne({ where:{email: 'example@gmail.com'}})
    token = generateToken(user)
    await Products.destroy({
      where: {},
      truncate: true
    });
    const response = await request(app)
      .get('/api/v1/products')
      .set('Authorization', `Bearer ${token}`)
    expect(response.statusCode).toBe(200);
  });
});




describe('Search products endpoint', () => {
  let products;
  beforeAll(async () => {
    // Set up test data
    const createUser = User.create({
  firstname: "myfirstname",
  lastname: "mysecondname",
  email: "test@gmail.com",
  password: "testpass2345",
})
     products = await Products.bulkCreate([
      {
        name: 'Product 1',
        price: 10.0,
        quantity: 5,
        expiryDate: new Date('2022-01-01'),
      },
      {
        name: 'Product 2',
        price: 20.0,
        quantity: 10,
        expiryDate: new Date('2023-01-01'),
      },
      {
        name: 'Product 3',
        price: 30.0,
        quantity: 15,
        expiryDate: new Date('2023-01-01'),
      },
    ]);
  });


  it('should return 200 if user is not logged in', async () => {
      
    // Make a request to update the user status
    const response = await request(app)
      .get('/api/v1/products/search')
      .set('Authorization', "" )

    // Expect a 200 status code and error message
    expect(response.status).toBe(401);
  
  });
let UserToken
  test('should return all products when no filters are specified', async () => {
    const user = await User.findOne({where:{email:'test@gmail.com'}})
    UserToken = generateToken(user)
    const response = await request(app).get('/api/v1/products/search')
   .set('Authorization', `Bearer ${UserToken}` )
    expect(response.status).toBe(200);
  });

  test('should filter products by name', async () => {
    const response = await request(app).get('/api/v1/products/search?name=Product 1')
    .set('Authorization', `Bearer ${UserToken}` )
    expect(response.status).toBe(200);
  });

  test('should filter products by price range', async () => {
    const response = await request(app).get('/api/v1/products/search?minPrice=10&maxPrice=20')
    .set('Authorization', `Bearer ${UserToken}` )
    expect(response.status).toBe(200);

  });

  test('should filter products by price categoryId', async () => {
    const response = await request(app).get('/api/v1/products/search?catego')
    .set('Authorization', `Bearer ${UserToken}` )
    expect(response.status).toBe(200);

  });

});