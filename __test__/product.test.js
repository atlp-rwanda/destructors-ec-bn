import request from 'supertest';
import app from '../src/app';
import path from 'path';

const { User } = require('../src/database/models');
import { Categories } from '../src/database/models';
import { generateToken } from '../src/utils/generateToken';
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
});
