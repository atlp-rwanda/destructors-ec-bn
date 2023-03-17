const request = require('supertest');
import app, { connectDB } from '../src/app';
const User = require('../src/models/user');

connectDB(); // connect database

describe('Update password feature', () => {
  let user;
  let token;

  beforeAll(async () => {
    // create a user and authenticate with JWT
    const userData = {
      firstname: 'Test',
      lastname: 'User',
      email: 'testuser@example.com',
      password: 'P@ssw0rd',
    };
    user = await User.create(userData);
    const res = await request(app)
      .post('/api/v1/users/login')
      .send({ email: userData.email, password: userData.password });
    token = res.body.token;
  });

  afterAll(async () => {
    // remove the test user from database
    await user.destroy();
  });

  describe('PATCH /api/v1/users/update-password', () => {
    const newPassword = 'NewP@ssw0rd';

    test('should return 401 Unauthorized if user is not authenticated', async () => {
      const res = await request(app)
        .patch('/api/v1/users/update-password')
        .send({
          passwordCurrent: user.password,
          password: newPassword,
          passwordConfirm: newPassword,
        });
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty(
        'error',
        'You are not logged in. Please log in to access.'
      );
    });

    test('should return 400 Bad Request if password current is incorrect', async () => {
      const res = await request(app)
        .patch('/api/v1/users/update-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          passwordCurrent: 'wrongpassword',
          password: newPassword,
          passwordConfirm: newPassword,
        });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        'error',
        'Your current password is wrong.'
      );
    });

    test('should return 400 Bad Request if new passwords do not match', async () => {
      const res = await request(app)
        .patch('/api/v1/users/update-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          passwordCurrent: user.password,
          password: newPassword,
          passwordConfirm: 'mismatchedpassword',
        });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Passwords do not match');
    });

    test('should return 200 OK and update user password if input is valid', async () => {
      const res = await request(app)
        .patch('/api/v1/users/update-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          passwordCurrent: user.password,
          password: newPassword,
          passwordConfirm: newPassword,
        });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body.data.user.password).not.toBe(user.password); // check if password is updated
    });
  });
});
