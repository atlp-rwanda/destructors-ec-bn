import request from 'supertest';
import jest from 'jest';
import expect from 'chai';
import app from '../src/app.js';

jest.setTimeout(30000);

describe('Testing registration User', () => {
  test('It should return 400 for bad request', async () => {
    const response = await request(app).post('/api/v1/users/signup').send({
      email: 'dummyEmail@gmail.com',
      password: 'dummpassword435',
    });
    expect(response.statusCode).toEqual(400);
  });
  test('Get a status of 200', async () => {
    const response = await request(app).post('/api/v1/users/signup').send({
      firstname: 'myfirstname',
      lastname: 'mysecondname',
      email: 'testemail1234@gmail.com',
      password: 'testpass2345',
    });
    // token = await response.body.token;
    expect(response.statusCode).toEqual(201);
  });
});
