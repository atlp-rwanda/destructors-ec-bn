import request from 'supertest';
import app from '../src/app';
import { Categories } from '../src/database/models';
import { User } from '../src/database/models';
import { generateToken } from '../src/utils/generateToken';

describe('Testing Categories endpoint', () => {
  let buyerCategory;
  let token;

  beforeAll(async () => {
    buyerCategory = await User.create({
      firstname: 'myfirategory',
      lastname: 'mysecondname',
      email: 'testbuyercato1@gmail.com',
      password: 'testpass2345',
    });
  });
  test('should return 401 when user is not logged in', async () => {
    const response = await request(app).post('/api/v1/categories').send({
      name: 'shoes women',
    });
    expect(response.statusCode).toBe(401);
  });
  test('it should return 401 when user is not seller or admin', async () => {
    token = generateToken(buyerCategory);
    const response = await request(app)
      .post('/api/v1/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'shoes women',
      });
    expect(response.statusCode).toBe(401);
  });
  test('it should return 201 when user is seller or admin', async () => {
    await buyerCategory.update({ role: 'seller' });
    token = generateToken(buyerCategory);
    const response = await request(app)
      .post('/api/v1/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'shoes women',
      });
    expect(response.statusCode).toBe(201);
  });
  test('it should return 400 when category name is empty', async () => {
    await buyerCategory.update({ role: 'seller' });
    token = generateToken(buyerCategory);
    const response = await request(app)
      .post('/api/v1/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: '',
      });
    expect(response.statusCode).toBe(400);
  });
  test('it should return 404 when user category is already created', async () => {
    await buyerCategory.update({ role: 'seller' });
    token = generateToken(buyerCategory);
    const response = await request(app)
      .post('/api/v1/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'shoes women',
      });
    expect(response.statusCode).toBe(404);
  });
  test('it should return 401 when for getting category to buyer', async () => {
    await buyerCategory.update({ role: 'buyer' });
    token = generateToken(buyerCategory);
    const response = await request(app)
      .get('/api/v1/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'shoes women',
      });
    expect(response.statusCode).toBe(401);
  });
  test('should return 401 for retrieving category when user is not logged in', async () => {
    const response = await request(app).get('/api/v1/categories');
    expect(response.statusCode).toBe(401);
  });
  test('it should return 401 when for getting category to buyer', async () => {
    await buyerCategory.update({ role: 'buyer' });
    token = generateToken(buyerCategory);
    const response = await request(app)
      .get('/api/v1/categories')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(401);
  });
  test('it should return 200 when for getting category to seller or admin', async () => {
    await buyerCategory.update({ role: 'seller' });
    token = generateToken(buyerCategory);
    const response = await request(app)
      .get('/api/v1/categories')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });
});
