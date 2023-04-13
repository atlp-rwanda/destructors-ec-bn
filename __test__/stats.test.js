import request from "supertest";
import app from '../src/app';
import { User } from "../src/database/models/";
import { generateToken } from '../src/utils/generateToken';

jest.setTimeout(50000);
describe('Testing GetSellerStats endpoint', () => {
  let token;
  let email ='testemail12@gmail.com'
  let sellerToken;

  beforeAll(async () => {

    const response = await request(app).post('/api/v1/users/signup').send({
      firstname: 'myfirstname',
      lastname: 'mysecondname',
      email: email,
      password: 'testpass2345',
    });
    token = await response.body.token;
  });

  test('should return 200 with stats when user is authorized to view own stats', async () => {
    const user = await User.findOne({ where: { email: email } });
    await user.update({ role: 'seller' });
    sellerToken = generateToken(user);

    const response = await request(app)
      .get('/api/v1/stats')
      .set('Authorization', `Bearer ${sellerToken}`);
    expect(response.statusCode).toBe(200);
  });

  test('should return 401 when the token is invalid', async () => {
    const response = await request(app)
      .get('/api/v1/stats')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Unauthorized User')
  });

});

