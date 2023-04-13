import request from 'supertest';
import app from '../src/app';
import { User, Orders, Sales } from '../src/database/models';
import { generateToken } from '../src/utils/generateToken';
jest.setTimeout(30000);
describe('Tracking the Order Status', () => {
  let orderId;
  let buyerId;
  let buyerToken;
  let buyer;
  let Sale;
  let order;

  beforeAll(async () => {
    // Create a test buyer
    buyer = await User.create({
      firstname: 'Test',
      lastname: 'Buyer',
      email: 'test-buyer-email@example.com',
      password: 'password',
      role: 'buyer',
    });

    buyerId = await buyer.id;

    // Generate an access token for the test buyer
    buyerToken = generateToken(buyer);

    order = await Orders.create({
      paymentId: '121a0572-4538-4de1-9ed5-62151d16eb6c',
      userId: buyerId,
      email: 'test-buyer-email@example.com',
      amount: 30000,
      status: 'payed',
    });

    orderId = await order.id;

    Sale = await Sales.create({
      orderId: orderId,
      sellerId: 'f6053eb8-247e-4964-aae4-147f90a4fd64',
      status: 'paid',
    });

  });

  test('should return the status of the order', async () => {
    const res = await request(app)
      .get(`/api/v1/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${buyerToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.orderStatus).toEqual('paid');
  });

  test('should return an error if the order does not exist', async () => {
    const res = await request(app)
      .get(`/api/v1/orders/${buyerId}/status`)
      .set('Authorization', `Bearer ${buyerToken}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body.error).toEqual('Order not found');
  });
});
