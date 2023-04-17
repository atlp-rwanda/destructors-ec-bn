import request from 'supertest';
import app from '../src/app';
import path from 'path';
const { User } = require('../src/database/models');
import { Products } from '../src/database/models';
import { Categories } from '../src/database/models';
import { generateToken } from '../src/utils/generateToken';
jest.setTimeout(50000);

describe('Test user payments', () => {
  let categories;
  beforeAll(async () => {
    categories = await Categories.create({
      name: 'vehicles',
    });
  });

  let token = '';
  let sellerToken = '';
  let email = 'testemailcart1@gmail.com';
  let productId = '';

    test('it should return 200 when user it signed up', async () => {
        const response = await request(app).post('/api/v1/users/signup').send({
        firstname: 'myfirstname',
        lastname: 'mysecondname',
        email: email,
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
        const user = await User.findOne({ where: { email: email } });
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
        const user = await User.findOne({ where: { email: email } });
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
        const user = await User.findOne({ where: { email: email } });
        await user.update({ role: 'seller' });
        sellerToken = generateToken(user);
        const productName = 'volks Wagen';
        const createProductresponse = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${sellerToken}`)
        .field('name', productName)
        .field('price', 5000)
        .field('categoryId', categories.id)
        .field('quantity', 5)
        .attach('image', path.resolve(__dirname, './images/image.jpg'))
        .attach('image', path.resolve(__dirname, './images/image1.jpg'));

        const product = await Products.findOne({ where: { name: productName } });
        productId = product.id;
        const buyer = await User.findOne({ where: { email: email } });
        await buyer.update({ role: 'buyer' });
        token = generateToken(user);
        const response = await request(app)
        .post('/api/v1/carts')
        .set('Authorization', `Bearer ${token}`)
        .send({
            productId: productId,
            productQuantity: 10,
        });
        expect(response.statusCode).toBe(400);
    });
    test('It should pay a user cart',async()=>{
        const response = await request(app).post('/api/v1/pay')
        .set('Authorization', `Bearer ${token}`)
        .send({
            number:6011111111111117,
            exp_month:12,
            exp_year:24,
            cvc:123
        })
        expect(response.statusCode).toBe(403)
    })
    test('it should return 201 when product is added to cart', async () => {
        const product = await Products.findOne({ where: { id: productId } });
        await product.update({ isAvailable: true });

        const response = await request(app)
        .post('/api/v1/carts')
        .set('Authorization', `Bearer ${token}`)
        .send({
            productId: productId,
            productQuantity: 4,
        });
        console.log(response.body.message);
        expect(response.statusCode).toBe(201);
    });
    test('It should test invalid credit card',async()=>{
        const response = await request(app).post('/api/v1/pay')
        .set('Authorization', `Bearer ${token}`)
        .send({
            number:601111111117,
            exp_month:12,
            exp_year:24,
            cvc:123
        })
        expect(response.statusCode).toBe(403)
    })
    test('It should test year expiration',async()=>{
        const response = await request(app).post('/api/v1/pay')
        .set('Authorization', `Bearer ${token}`)
        .send({
            number:6011111111111117,
            exp_month:12,
            exp_year:21,
            cvc:123
        })
        expect(response.statusCode).toBe(403)
    })
    test('It should test invalid credit cvc',async()=>{
        const response = await request(app).post('/api/v1/pay')
        .set('Authorization', `Bearer ${token}`)
        .send({
            number:6011111111111117,
            exp_month:12,
            exp_year:24,
            cvc:1
        })
        expect(response.statusCode).toBe(403)
    })
    test('It should pay a user cart',async()=>{
        const response = await request(app).post('/api/v1/pay')
        .set('Authorization', `Bearer ${token}`)
        .send({
            number:6011111111111117,
            exp_month:12,
            exp_year:24,
            cvc:123
        })
        expect(response.statusCode).toBe(200)
    })
});
