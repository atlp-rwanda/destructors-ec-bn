import request from 'supertest';
import path from 'path';
import app from '../src/app';
import { Products, Categories, Orders  } from '../src/database/models';

import { generateToken } from '../src/utils/generateToken';

const { User } = require('../src/database/models');

jest.setTimeout(100000);

describe('Test user payments', () => {
  let categories;
  beforeAll(async () => {
    categories = await Categories.create({
      name: 'vehicles',
    });
  });

  let token = '';
  let sellerToken = '';
  const email = 'testemailcart1@gmail.com';
  let productId = '';

  test('it should return 200 when user it signed up', async () => {
    const response = await request(app).post('/api/v1/users/signup').send({
      firstname: 'myfirstname',
      lastname: 'mysecondname',
      email,
      password: '@Password12',
    });
    token = await response.body.token;
    expect(response.statusCode).toBe(201);
    expect(token).not.toBeNull();
  });
  test('it should not add product when user is not logged in', async () => {
    const response = await request(app).post('/api/v1/carts').send({
      productId: '1fcf98b7-75f0-4a6b-90c5-9906dc86d276',
      productQuantity: 10,
    });
    expect(response.statusCode).toBe(401);
  });
  test('it should not add product when user is not buyer', async () => {
    const user = await User.findOne({ where: { email } });
    await user.update({ role: 'seller' });
    sellerToken = generateToken(user);
    const response = await request(app)
      .post('/api/v1/carts')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({
        productId: '1fcf98b7-75f0-4a6b-90c5-9906dc86d276',
        productQuantity: 10,
      });
    expect(response.statusCode).toBe(401);
  });
  test('it should return status 400 when productId is not provided ', async () => {
    const user = await User.findOne({ where: { email } });
    await user.update({ role: 'buyer' });
    token = generateToken(user);
    const response = await request(app)
      .post('/api/v1/carts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId: '',
        productQuantity: 10,
      });
    expect(response.statusCode).toBe(400);
  });
  test('it should return 400 when product stock is not enough', async () => {
    const user = await User.findOne({ where: { email } });
    await user.update({ role: 'seller' });
    sellerToken = generateToken(user);
    const productName = 'volks Wagen';
    const createProductresponse = await request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${sellerToken}`)
      .field('name', productName)
      .field('description', 'two people sofa')
      .field('price', 5000)
      .field('categoryId', categories.id)
      .field('quantity', 5)
      .attach('image', path.resolve(__dirname, './images/image.jpg'))
      .attach('image', path.resolve(__dirname, './images/image1.jpg'));

    const product = await Products.findOne({ where: { name: productName } });
    productId = product.id;
    const buyer = await User.findOne({ where: { email } });
    await buyer.update({ role: 'buyer' });
    token = generateToken(user);
    const response = await request(app)
      .post('/api/v1/carts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId,
        productQuantity: 10,
      });
    expect(response.statusCode).toBe(400);
  });
  test('it should return 201 when product is added to cart', async () => {
    const product = await Products.findOne({ where: { id: productId } });
    await product.update({ isAvailable: true });

    const response = await request(app)
      .post('/api/v1/carts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId,
        productQuantity: 4,
      });
    expect(response.statusCode).toBe(201);
  });
  test('It should provide stripe payment checkout link', async () => {
    const response = await request(app).post('/api/v1/pay')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(201);
  });

  test('It should pay a user cart', async () => {
    await Orders.create({
      paymentId: 'cs_test_a1PucVBlRW3Bx7Dqzcbd6cbaay1ym6C2GcOBdMaDESfzsBU9grWIWn8H6L',
      userId: 'd0db925d-03b7-4e7a-a800-7a8d0823fd00',
      email: 'buyer@gmail.com',
      amount: 30000,
      status: 'payed',
      products: [
        {
          name: 'AirMax',
          price: 30000,
          quantity: 1,
          sellerId: 'd0db925d-03b7-4e7a-a838-7a8d0823fd97',
        },
      ],
    });
    const response = await request(app).get('/api/v1/success?paymentId=cs_test_a1PucVBlRW3Bx7Dqzcbd6cbaay1ym6C2GcOBdMaDESfzsBU9grWIWn8H6L')
    expect(response.statusCode).toBe(201);
  });
  test('It should return 500 when stripe session id is not provided', async () => {
    const response = await request(app).get('/api/v1/success')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(500);
  });
});
