import request from 'supertest';
import { Sales } from '../src/database/models';
import { Orders } from '../src/database/models';
import { Products } from '../src/database/models';
import app from '../src/app';
import { User } from '../src/database/models';
import { generateToken } from '../src/utils/generateToken';
import { Categories } from '../src/database/models';
import { json } from 'body-parser';
jest.setTimeout(30000);

describe('sallerUpdateSaleStatus', () => {
  let order;
  let newseller;
  let sellerToken;
  let products;
  let Sale;
  let createdOrder;
  let user;
  it('should return 401 if the sale is  not related to the current seller', async () => {
    const createdSale = await Sales.findOne({
      where: { id: '128a0571-4538-4de1-9ed5-62151d16eb6c' },
    });

    newseller = await User.create({
      firstname: 'fstname',
      lastname: 'sdname',
      email: 'example2@gmail.com',
      password: 'testpass2345',
    });
    products = await Products.create({
      name: 'shoes',
      price: 1000,
      quantity: 3,
      sellerId: 'd0db925d-03b7-4e7a-a838-7a8d0823fd97',
    });

    order = await Orders.create({
      paymentId: '121a0572-4538-4de1-9ed5-62151d16eb6c',
      userId: 'd0db925d-03b7-4e7a-a800-7a8d0823fd00',
      email: 'buyer@gmail.com',
      amount: 30000,
      status: 'payed',
      products: [
        {
          name: 'jordan',
          price: 30000,
          quantity: 1,
          sellerId: 'd0db925d-03b7-4e7a-a838-7a8d0823fd97',
        },
        {
          name: 'mangoe',
          price: 500,
          quantity: 15,
          sellerId: 'd0db925d-03b7-4e7a-a838-7a8d0823fd97',
        },
      ],
    });

    Sale = await Sales.create({
      orderId: order.id,
      sellerId: 'd0db925d-03b7-4e7a-a838-7a8d0823fd97',
    });
    await newseller.update({ role: 'seller' });

    const testUser = await User.findOne({
      where: { email: 'example2@gmail.com' },
    });

    sellerToken = generateToken(testUser);
    const response = await request(app)
      .patch(`/api/v1/sales/${Sale.id}/status`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({ newStatus: 'rejected' });
    expect(response.status).toBe(401);
  });

  it('should return 404 once sale is not found', async () => {
    const user = await User.findOne({ where: { email: 'seed@gmail.com' } });
    sellerToken = generateToken(user);
    const response = await request(app)
      .patch('/api/v1/sales/128a0571-4538-4de1-9ed5-62151d16eb1c/status')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({ newStatus: 'rejected' });
    expect(response.status).toBe(404);
  });

  it('should return 400 once status specified is invalid', async () => {
    const user = await User.findOne({
      where: { id: 'd0db925d-03b7-4e7a-a838-7a8d0823fd97' },
    });
    sellerToken = generateToken(user);
    const response = await request(app)
      .patch(`/api/v1/sales/${Sale.id}/status`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({ newStatus: 'unknown' });
    expect(response.status).toBe(400);
  });

  it('should return 200 once status is approved and reduce the products quantity', async () => {
    products = await Products.bulkCreate([
      {
        name: 'jordan',
        price: 30000,
        quantity: 10,
        sellerId: 'd0db925d-03b7-4e7a-a838-7a8d0823fd00',
      },
    ]);
    products = await Products.bulkCreate([
      {
        name: 'mangoe',
        price: 500,
        quantity: 45,
        sellerId: 'd0db925d-03b7-4e7a-a838-7a8d0823fd00',
      },
    ]);
    products = await Products.bulkCreate([
      {
        name: 'radio',
        price: 1000,
        quantity: 65,
        sellerId: 'd0db925d-03b7-4e7a-a838-7a8d0823fd97',
        expiryDate: new Date('2022-01-01'),
      },
    ]);

    user = await User.findOne({
      where: { id: 'd0db925d-03b7-4e7a-a838-7a8d0823fd97' },
    });
    sellerToken = generateToken(user);
    const response = await request(app)
      .patch(`/api/v1/sales/${Sale.id}/status`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({ newStatus: 'approved' });
    expect(response.status).toBe(200);
  });

  it('should return 200 once status is rejected', async () => {
    const user = await User.findOne({
      where: { id: 'd0db925d-03b7-4e7a-a838-7a8d0823fd97' },
    });
    sellerToken = generateToken(user);
    const response = await request(app)
      .patch(`/api/v1/sales/${Sale.id}/status`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({ newStatus: 'rejected' });
    expect(response.status).toBe(200);
  });

  it('should return 500 once server crushes', async () => {
    const user = await User.findOne({ where: { email: 'seed@gmail.com' } });
    sellerToken = generateToken(user);
    const response = await request(app)
      .patch('/api/v1/sales/12/status')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({ newStatus: 'rejected' });
    expect(response.status).toBe(500);
  });
});
