import request from 'supertest';
import jwt from 'jsonwebtoken';
import { updateUserStatus, assignUserRole } from '../src/docs-data';
import User from '../src/database/models';
import { generateToken } from '../src/utils/generateToken';
jest.setTimeout(30000);

const JWT_SECRET = 'heloomrjsj';

describe('updateUserStatus', () => {
  let token;
  let adminToken;
  jest.setTimeout(30000);

  const createUser = User.User.create({
    firstname: 'myfirstname',
    lastname: 'mysecondname',
    email: 'test@gmail.com',
    password: 'testpass2345',
  });

  it('should return 403 if user is not an admin', async () => {
    // Make a request to update the user status
    const response = await request(app)
      .patch('/api/v1/users/a1a96a86-d898-45d2-896f-51898966b838/status')
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImZpcnN0bmFtZSI6Im15Zmlyc3RuYW1lIiwibGFzdG5hbWUiOiJteXNlY29uZG5hbWUiLCJlbWFpbCI6InRlc3RlbWFpbDEyMzRAZ21haWwuY29tIiwicGFzc3dvcmQiOiJ0ZXN0cGFzczIzNDUifSwiaWF0IjoxNjc5MzA2MTU2fQ.c1yIElDbYBGHkGoB2jS7pcOs2EG3_OJGZdqeSJTaGIw'
      )
      .send({ email: 'testemail1234@gmail.com' });

    // Expect a 400 status code and error message
    expect(response.status).toBe(400);
  });

  it('should return 404 if user to update is not found', async () => {
    const adminpyload = await User.User.findOne({
      where: { email: 'admin@gmail.com' },
    });
    adminToken = generateToken(adminpyload);
    // Make a request to update a non-existent user
    const response = await request(app)
      .patch('/api/v1/users/a1a96a86-d898-45d2-896f-51898966b830/status')
      .set('Authorization', `Bearer ${adminToken}`);

    // Expect a 404 status code and error message
    expect(response.status).toBe(404);
  });

  it('should update user status and return updated user', async () => {
    const user = await User.User.findOne({
      where: { email: 'test@gmail.com' },
    });
    const adminpyload = await User.User.findOne({
      where: { email: 'admin@gmail.com' },
    });
    adminToken = generateToken(adminpyload);

    console.log(adminToken);
    const response = await request(app)
      .patch(`/api/v1/users/${user.id}/status`)
      .set('Authorization', `Bearer ${adminToken}`);

    // Expect a 200 status code and updated user data
    expect(response.status).toBe(200);
  });
});

describe('assignUserRole', () => {
  let adminToken;
  let token;
  test('Get a status of 200', async () => {
    const response = await request(app).post('/api/v1/users/signup').send({
      firstname: 'firstname',
      lastname: 'secondname',
      email: 'metest1234@gmail.com',
      password: 'testpass2345',
    });
    token = await response.body.token;
    expect(response.statusCode).toBe(201);
  });

  it('should return 403 if user is not an admin', async () => {
    // Make a request to update the user status
    const response = await request(app)
      .patch('/api/v1/users/a1a96a86-d898-45d2-896f-51898966b838/roles')
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImZpcnN0bmFtZSI6Im15Zmlyc3RuYW1lIiwibGFzdG5hbWUiOiJteXNlY29uZG5hbWUiLCJlbWFpbCI6InRlc3RlbWFpbDEyMzRAZ21haWwuY29tIiwicGFzc3dvcmQiOiJ0ZXN0cGFzczIzNDUifSwiaWF0IjoxNjc5MzA2MTU2fQ.c1yIElDbYBGHkGoB2jS7pcOs2EG3_OJGZdqeSJTaGIw'
      )
      .send({ email: 'metest1234@gmail.com', newRole: 'seller' });

    // Expect a 400 status code and error message
    expect(response.status).toBe(400);
  });
  it('should return 404 if user to assign role is not found is not found', async () => {
    const adminpyload = await User.User.findOne({
      where: { email: 'admin@gmail.com' },
    });
    adminToken = generateToken(adminpyload);
    // Make a request to update a non-existent user
    const response = await request(app)
      .patch('/api/v1/users/a1a96a86-d898-45d2-896f-51898966b838/roles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ newRole: 'seller' });

    // Expect a 404 status code and error message
    expect(response.status).toBe(404);
  });

  it('should return invalid role if the assigned role in invalid', async () => {
    const user = await User.User.findOne({
      where: { email: 'test@gmail.com' },
    });
    const response = await request(app)
      .patch(`/api/v1/users/${user.id}/roles`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ newRole: 'customer' });

    // Expect a 200 status code and updated user data
    expect(response.status).toBe(400);
  });

  it('should assign newrole to the selected user', async () => {
    const user = await User.User.findOne({
      where: { email: 'test@gmail.com' },
    });

    // Make a request to update the user's status
    const response = await request(app)
      .patch(`/api/v1/users/${user.id}/roles`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ newRole: 'seller' });

    // Expect a 200 status code and updated user data
    expect(response.status).toBe(200);
  });
});
