import request from 'supertest';
import app from '../src/app';
import '../src/services/googleAuth';
import models from '../src/database/models/index';
import jwt from 'jsonwebtoken';
const { User, OTP } = require('../src/database/models');
import generateOTP from '../src/utils/generateOTP';

jest.setTimeout(30000);
describe('Testing registration User', () => {
  let token, userId;
  test('It should return 400 for bad request', async () => {
    const response = await request(app).post('/api/v1/users/signup').send({
      email: 'dummyEmail@gmail.com',
      password: 'dummpassword435',
    });
    expect(response.statusCode).toBe(400);
  });
  test('Get a status of 200', async () => {
    const response = await request(app).post('/api/v1/users/signup').send({
      firstname: 'myfirstname',
      lastname: 'mysecondname',
      email: `testemail1234@gmail.com`,
      password: 'testpass2345',
    });
    token = await response.body.token;
    expect(response.statusCode).toBe(201);
  });
  test('should verify user email', async () => {
    const response = await request(app)
      .get(`/api/v1/users/verify-email?t=${token}`)
      .expect(200);
    expect(response.body).toHaveProperty('message', 'email verified');
  });

  test('It should not login with invalid email', async () => {
    const res = await request(app).post('/api/v1/users/login').send({
      email: 'test@user.com',
      password: '@Password12',
    });
    expect(res.statusCode).toBe(401);
  });
  test('It should not login with invalid password', async () => {
    const res = await request(app).post('/api/v1/users/login').send({
      email: 'testemail1234@gmail.com',
      password: '@Password12',
    });
    expect(res.statusCode).toBe(401);
  });
  test('It should login with valid email and password', async () => {
    const res = await request(app)
      .post('/api/v1/users/login')
      .send({
        email: `testemail1234@gmail.com`,
        password: 'testpass2345',
      })
      .expect(200);
    expect(res.body).toHaveProperty('message', 'Successful login');
    expect(res.body).toHaveProperty('user');
    expect(res.body).toHaveProperty('token');
    userId = res.body.user.id;
  });
});

describe('this is for the user logging in ', () => {
  test('this is where the user try to get to the login page for the first time', async () => {
    await request(app)
      .get('/api/v1/users/auth')
      .expect(
        '<a href="/api/v1/users/login/google">do you want to access your account</a>'
      );
  });
  it('should redirect to Google login page', async () => {
    const res = await request(app).get('/api/v1/users/login/google');
    expect(res.status).toBe(302);
    expect(res.header['location']).toContain(
      'https://accounts.google.com/o/oauth2/v2/auth'
    );
  });
});
describe('GET /api/v1/users/google/callback', () => {
  it('should redirect to /api/v1/users/protected on success', async () => {
    const res = await request(app).get('/api/v1/users/google/callback');
    expect(res.status).toBe(302);
    expect(res.header['location']).toBe(
      'https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fv1%2Fusers%2Fgoogle%2Fcallback&client_id=314235844636-883r065qgdf7aglpqgndd8sg6fu6t9hj.apps.googleusercontent.com'
    );
  });
});

describe('Testing the reset password via email', () => {
  let token = '';
  test('It should return 404 for bad request if the user is not registered', async () => {
    const response = await request(app)
      .post('/api/v1/users/reset-password')
      .send({
        email: 'duEmil@gail.com',
      });
    expect(response.statusCode).toBe(404);
  });
  test('Get a status of 201', async () => {
    const response = await request(app).post('/api/v1/users/signup').send({
      firstname: 'mfirstname',
      lastname: 'msecondname',
      email: `tstmail1234@gmail.com`,
      password: 'testpass2345',
    });
    token = await response.body.token;
    expect(response.statusCode).toBe(201);
  });
  test('Get a status of 200 if  user is registered', async () => {
    const response = await request(app)
      .post('/api/v1/users/reset-password')
      .send({
        email: `tstmail1234@gmail.com`,
      });

    expect(response.statusCode).toBe(200);
  });

  test('Get a status of 404 if  user is not registered', async () => {
    const response = await request(app)
      .post('/api/v1/users/reset-password')
      .send({
        email: `tstmail@gmail.com`,
      });

    expect(response.statusCode).toBe(404);
  });

  test('Get a status of 400 if  user email is invalid', async () => {
    const response = await request(app)
      .post('/api/v1/users/reset-password')
      .send({
        email: `tstmail1234`,
      });

    expect(response.statusCode).toBe(400);
  });

  test('Get a status of 200 when the password is successfully changed', async () => {
    const newUser = await models.ResetPassword.create({
      email: 'katros@gamil.com',
      token: token,
    });
    const response = await request(app)
      .patch(`/api/v1/users/reset-password/${token}`)
      .send({
        password: 'katros23',
        confirmPassword: 'katros23',
      });

    expect(response.statusCode).toBe(200);
  });

  test('Get a status of 400 when the token provided has expired', async () => {
    const newUser = await models.ResetPassword.create({
      email: 'katros@gamil.com',
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoia2F0cm9zMjUwQGdtYWlsLmNvbSIsImlhdCI6MTY3OTM5MDQwOCwiZXhwIjoxNjc5MzkwNDY4fQ.80S2mmY768UpVKBjgjFiMl0wmsunsMujlypCV50guSY',
    });

    const response = await request(app)
      .patch(
        `/api/v1/users/reset-password/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoia2F0cm9zMjUwQGdtYWlsLmNvbSIsImlhdCI6MTY3OTM5MDQwOCwiZXhwIjoxNjc5MzkwNDY4fQ.80S2mmY768UpVKBjgjFiMl0wmsunsMujlypCV50guSY`
      )
      .send({
        password: 'katros23',
        confirmPassword: 'katros23',
      });

    expect(response.statusCode).toBe(400);
  });

  test('Get a status of 400 when confirm password not equal to password', async () => {
    const response = await request(app)
      .patch(`/api/v1/users/reset-password/${token}`)
      .send({
        password: 'katros23',
        confirmPassword: 'katros3',
      });

    expect(response.statusCode).toBe(400);
  });

  test('Get a status of 400 when password does not meet validation rules', async () => {
    const response = await request(app)
      .patch(`/api/v1/users/reset-password/${token}`)
      .send({
        password: 'katr',
      });

    expect(response.statusCode).toBe(400);
  });
  test('should get user profile', async () => {
    const res = await request(app)
      .get('/api/v1/users/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
  test('should update user profile', async () => {
    const res = await request(app)
      .put('/api/v1/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        gender: 'male',
        DOB: '3.02.2000',
        prefferedCurrency: 'RWF',
        prefferedLanguage: 'Kinyarwanda',
        street: 'street',
        province: 'kigali city',
        district: 'gasabo',
        phoneNo: '0787643782',
        email: 'usermailg@mail.com',
      });
    expect(res.statusCode).toBe(200);
  });

  test('should test invalid user if he/she try to update profile without valid token', async () => {
    const res = await request(app)
      .put('/api/v1/users/profile')
      .set(
        'Authorization',
        `Bearer ${'qwertyiuodisoaip[donk123jkhcsbkj(iweu__'}`
      )
      .send({
        gender: 'male',
        DOB: '3.02.2000',
        prefferedCurrency: 'RWF',
        prefferedLanguage: 'Kinyarwanda',
        street: 'street',
        province: 'kigali city',
        district: 'gasabo',
        phoneNo: '0787643782',
        email: 'usermailg@mail.com',
      });
    expect(res.statusCode).toBe(401);
  });

  test('It should put token in blacklist', async () => {
    const res = await request(app)
      .post('/api/v1/users/logout')
      .set('Authorization', `Bearer ${token}`)
      .send({
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoia2F0cm9zMjUwQGdtYWlsLmNvbSIsImlhdCI6MTY3OTM5MDQwOCwiZXhwIjoxNjc5MzkwNDY4fQ.80S2mmY768UpVKBjgjFiMl0wmsunsMujlypCV50guSY',
      });
    expect(res.statusCode).toBe(200);
  });
});

describe('Testing update user password after login', () => {
  let token = '',
    userId = '';
  beforeAll(async () => {
    // Register user
    const response = await request(app).post('/api/v1/users/signup').send({
      firstname: 'myfirstname',
      lastname: 'mysecondname',
      email: `testemail1234@gmail.com`,
      password: 'testpass2345',
    });
    token = await response.body.token;
  });

  beforeEach(async () => {
    // Login user
    const response = await request(app).post('/api/v1/users/login').send({
      email: `testemail1234@gmail.com`,
      password: 'testpass2345',
    });
    token = await response.body.token;
    userId = await response.body.user.id; // Save user ID to a variable
  });

  test('It should return 401 if user is not logged in', async () => {
    // Logout user
    token = '';
    const response = await request(app)
      .patch(`/api/v1/users/update-password`)
      .send({
        currentPassword: 'testpass2345',
        newPassword: 'newtestpass2345',
        confirmPassword: 'newtestpass2345',
      });
    expect(response.statusCode).toBe(401);
  });

  test('It should return 400 for Passwords do not match', async () => {
    const response = await request(app)
      .patch(`/api/v1/users/update-password`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: 'testpass2345',
        newPassword: 'newpassword',
        confirmPassword: 'confirmpassword',
      });
    expect(response.statusCode).toBe(400);
  });

  test('It should return 401 for invalid password', async () => {
    const response = await request(app)
      .patch(`/api/v1/users/update-password`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: 'invalidpassword',
        newPassword: 'newtestpass2345',
        confirmPassword: 'newtestpass2345',
      });
    expect(response.statusCode).toBe(401);
  });

  test('It should update user password', async () => {
    const response = await request(app)
      .patch(`/api/v1/users/update-password`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: 'testpass2345',
        newPassword: 'newtestpass2345',
        confirmPassword: 'newtestpass2345',
      });
    expect(response.statusCode).toBe(200);
  });

  afterAll(async () => {
    // Delete the registered user
    await User.destroy({ where: { id: userId } });
  });
});

describe('this is for testing the otp', () => {
  let token, userId;
  test('Get a status of 200', async () => {
    const response = await request(app).post('/api/v1/users/signup').send({
      firstname: 'myfirstname',
      lastname: 'mysecondname',
      email: `calvinbukarani@gmail.com`,
      password: 'testpass2345',
    });
    token = await response.body.token;
    expect(response.statusCode).toBe(201);
  });
  test('should verify user email', async () => {
    const response = await request(app)
      .get(`/api/v1/users/verify-email?t=${token}`)
      .expect(200);
    expect(response.body).toHaveProperty('message', 'email verified');
  });
  test('It should login with valid email and password', async () => {
    const res = await request(app)
      .post('/api/v1/users/login')
      .send({
        email: `calvinbukarani@gmail.com`,
        password: 'testpass2345',
      })
      .expect(200);
    expect(res.body).toHaveProperty('message', 'Successful login');
    expect(res.body).toHaveProperty('user');
    expect(res.body).toHaveProperty('token');
    userId = res.body.user.id;
  });
  test('should generate OTP and send email for seller', async () => {
    const user = await User.findOne({
      where: { email: 'calvinbukarani@gmail.com' },
    });

    await user.update({ role: 'seller' });
    const response = await request(app)
      .post('/api/v1/users/login')
      .send({ email: user.email, password: 'testpass2345' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      message: 'please verify your email...',
    });
    const otpRecord = await OTP.findOne({ where: { email: user.email } });
    expect(otpRecord).not.toBeNull();
  });
  test('returns a 200 response for a valid OTP and logs the user in', async () => {
    const user = await User.findOne({
      where: { email: 'calvinbukarani@gmail.com' },
    });
    const otp = await OTP.findOne({ where: { email: user.email } });
    const response = await request(app)
      .post(`/api/v1/users/login/validate/${token}`)
      .send({ otp: otp.otp });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('logged in successfully');
    expect(response.body.token).toBeDefined();
  });
  test('returns a 401 response with an error message for an invalid OTP', async () => {
    const otp = 123456;
    const response = await request(app)
      .post(`/api/v1/users/login/validate/${token}`)
      .send({ otp: otp });
    expect(response.statusCode).toBe(401);
  });
});
