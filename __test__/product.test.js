import request from 'supertest';
import app from '../src/app';
import path from 'path';
import { Sequelize } from '../src/database/models';
const { User } = require('../src/database/models');
import { Products } from '../src/database/models';
import { Categories } from '../src/database/models';
import { generateToken } from '../src/utils/generateToken';
import { Orders, Sales } from '../src/database/models';
jest.setTimeout(50000);

describe('Testing Products service', () => {
  let categories;
  beforeAll(async () => {
    categories = await Categories.create({
      name: 'clothers',
    });
  });
  let sellerToken = '';
  let email = 'testemail123456@gmail.com';
  let token = '';
  let item = '';

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
      .field('description', 'two people sofa')
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
      .field('description', 'two people sofa')
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
      .field('description', 'two people sofa')
      .field('price', 5000)
      .field('categoryId', categories.id)
      .attach('image', path.resolve(__dirname, './images/image.jpg'))
      .attach('image', path.resolve(__dirname, './images/image1.jpg'));
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toStrictEqual(
      'Product is already exist, Please update the stock instead'
    );
  });
  test('it should return 200 for retrieving list of all products which are available', async () => {
    const response = await request(app)
      .get('/api/v1/products')
      .set('Authorization', `Bearer ${sellerToken}`);
    expect(response.statusCode).toBe(200);
  });
  test('it should return 200 for retrieving list of all products which are in collection of seller', async () => {
    const response = await request(app)
      .get('/api/v1/products')
      .set('Authorization', `Bearer ${sellerToken}`);
    expect(response.statusCode).toBe(200);
  });
  test('it should return 200 for retrieving list of all products which are available', async () => {
    await User.create({
      firstname: 'firstname',
      lastname: 'secondname',
      email: 'example@gmail.com',
      password: 'testpass2345',
    });
    const user = await User.findOne({ where: { email: 'example@gmail.com' } });
    token = generateToken(user);
    const response = await request(app)
      .get('/api/v1/products')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });
  test('it should return 200 for retrieving list of all products for all users', async () => {
    const response = await request(app)
      .get('/api/v1/products/public')
    expect(response.statusCode).toBe(200);
  });
  test('it should return 200 for retrieving  a product', async () => {
    item = await Products.findOne({ where: { name: 'two people sofa' } });
    const response = await request(app)
      .get(`/api/v1/products/${item.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });
  test('it should return 200 for retrieving  a product in seller collection', async () => {
    const item = await Products.findOne({ where: { name: 'two people sofa' } });
    const response = await request(app)
      .get(`/api/v1/products/${item.id}`)
      .set('Authorization', `Bearer ${sellerToken}`);
    expect(response.statusCode).toBe(200);
  });
  test('it should return 404 if there are no product in store', async () => {
    const newseller = await User.create({
      firstname: 'fstname',
      lastname: 'sdname',
      email: 'example23@gmail.com',
      password: 'testpass2345',
    });
    const newSellerToken = generateToken(newseller);
    const response = await request(app)
      .get(`/api/v1/products/1a2ef741-1488-4435-b2e2-4075a6a169eb`)
      .set('Authorization', `Bearer ${newSellerToken}`);
    expect(response.statusCode).toBe(404);
  });
  test('it should return 200 if there are no product in seller collection', async () => {
    const newseller = await User.create({
      firstname: 'fstname',
      lastname: 'sdname',
      email: 'example2@gmail.com',
      password: 'testpass2345',
    });
    await newseller.update({ role: 'seller' });
    const newSellerToken = generateToken(newseller);
    const response = await request(app)
      .get(`/api/v1/products`)
      .set('Authorization', `Bearer ${newSellerToken}`);
    expect(response.statusCode).toBe(200);
  });
  test('it should return 404 if the product is not found in seller collection', async () => {
    const newseller = await User.create({
      firstname: 'fstname',
      lastname: 'sdname',
      email: 'example25@gmail.com',
      password: 'testpass2345',
    });
    await newseller.update({ role: 'seller' });
    const newSellerToken = generateToken(newseller);
    const response = await request(app)
      .get(`/api/v1/products/1a2ef741-1488-4435-b2e2-4075a6a169eb`)
      .set('Authorization', `Bearer ${newSellerToken}`);
    expect(response.statusCode).toBe(404);
  });
  test('it should return 500 if the id provided is invalid', async () => {
    const newseller = await User.findOne({
      where: { email: 'example25@gmail.com' },
    });
    const newSellerToken = generateToken(newseller);
    const response = await request(app)
      .get(`/api/v1/products/1a2ef741-1488-4435-b2e2-4075a6a169`)
      .set('Authorization', `Bearer ${newSellerToken}`);
    expect(response.statusCode).toBe(500);
  });
  describe('POST /api/v1/product-wishes', () => {
    it('should add a product to the wishlist', async () => {
      const product = await Products.findOne({
        where: { name: 'two people sofa' },
      });
      const user = await User.findOne({ where: { email } });
      await user.update({ role: 'buyer' });
      const productId = product.id;
      token = generateToken(user);
      const response = await request(app)
        .post('/api/v1/product-wishes')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: productId });
      expect(response.status).toBe(201);
    });

    it('should remove a product from the wishlist if it already exists', async () => {
      const product = await Products.findOne({
        where: { name: 'two people sofa' },
      });
      const user = await User.findOne({ where: { email } });
      const productId = product.id;
      token = generateToken(user);
      const response = await request(app)
        .post('/api/v1/product-wishes')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: productId });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('product unwished  succesfully!');
    });
    it('should return a 401 error if user is not authorized', async () => {
      const response = await request(app)
        .post('/api/v1/product-wishes')
        .send({ userId: 1, productId: 1 });
      expect(response.status).toBe(401);
    });
    it('should return a 400 error if something goes wrong', async () => {
      const user = {
        id: 1,
        email: 'testuser@example.com',
        role: 'customer',
      };
      const product = {
        id: 1,
        name: 'Test Product',
        price: 9.99,
      };
      const response = await request(app)
        .post('/api/v1/product-wishes')
        .set('Authorization', `Bearer ${token}`)
        .send({ userId: user.id, productId: product.id });
      expect(response.status).toBe(400);
    });
    it('should  return all product wishes of a buyer from the database', async () => {
      const user = await User.findOne({ where: { email: email } });
      token = generateToken(user);
      const response = await request(app)
        .get('/api/v1/product-wishes')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
    });
    it('should return 200 if user is  authorized', async () => {
      const user = await User.findOne({ where: { email: email } });
      token = generateToken(user);
      const response = await request(app)
        .get('/api/v1/product-wishes')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });
    it('should return all product wishes grouped by product for a seller', async () => {
      const user = await User.findOne({ where: { email: email } });
      await user.update({ role: 'seller' });
      sellerToken = generateToken(user);
      const response = await request(app)
        .get('/api/v1/product-wishes')
        .set('Authorization', `Bearer ${sellerToken}`);

      expect(response.status).toBe(200);
    });
    it('should return 401 if user is not a buyer or seller', async () => {
      const user = await User.findOne({ where: { email: 'admin@test.com' } });
      token = generateToken(user);

      const response = await request(app)
        .get('/api/v1/product-wishes')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(401);
    });
    it('Get:/api/v1/productwishes/:id  should return the number of wishes for a given product', async () => {
      const sellerUser = await User.findOne({
        where: { email: email, role: 'seller' },
      });
      const product = await Products.findOne({
        where: { name: 'two people sofa' },
      });

      sellerToken = generateToken(sellerUser);
      const response = await request(app)
        .get(`/api/v1/products/${product.id}/product-wishes`)
        .set('Authorization', `Bearer ${sellerToken}`);

      expect(response.status).toBe(200);
    });
    it('should return 401 for unauthorized users', async () => {
      const buyerUser = await User.findOne({ where: { role: 'buyer' } });
      const product = await Products.findOne({
        where: { name: 'two people sofa' },
      });

      const authToken = generateToken(buyerUser);
      const response = await request(app)
        .get(`/api/v1/products/${product.id}/product-wishes`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(401);
      expect(response.text).toBe('"unAuthorized user !"');
    });
  });
  describe('Testing Products availability', () => {
    test('it should return 201 for post product when user is seller', async () => {
      const user = await User.findOne({ where: { email: email } });
      await user.update({ role: 'seller' });
      sellerToken = generateToken(user);
      const response = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${sellerToken}`)
        .field('name', 'nike shoes two pairs')
        .field('description', 'two people sofa')
        .field('price', 5000)
        .field('categoryId', categories.id)
        .attach('image', path.resolve(__dirname, './images/image.jpg'))
        .attach('image', path.resolve(__dirname, './images/image1.jpg'));
      expect(response.statusCode).toBe(201);
      expect(sellerToken).not.toBeNull();
      expect(response.body.message).toStrictEqual(
        'Products created successfull'
      );
    });

    test('unAvailable', async () => {
      const res = await request(app)
        .patch(
          '/api/v1/products/9974076f-e16a-486f-a923-362ec1747a12/availability'
        )
        .set('Authorization', `Bearer ${sellerToken}`)
        .send({ isAvailable: false });
      expect(res.status).toBe(404);
    });

    test('should update the product availability', async () => {
      item = await Products.findOne({ where: { name: 'two people sofa' } });
      const res = await request(app)
        .patch(`/api/v1/products/${item.id}/availability`)
        .set('Authorization', `Bearer ${sellerToken}`);
      expect(res.status).toBe(200);
    });
    test('should return 401 when user is not a seller', async () => {
      item = await Products.findOne({ where: { name: 'two people sofa' } });
      const res = await request(app)
        .patch(`/api/v1/products/${item.id}/availability`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(401);
    });
    test('should return 200 when product is updated', async () => {
      const res = await request(app)
        .patch(`/api/v1/products/${item.id}`)
        .set('Authorization', `Bearer ${sellerToken}`)
        .field('name', 'nike shoes four pairs')
        .field('price', 5000)
        .field('categoryId', categories.id)
        .attach('image', path.resolve(__dirname, './images/image.jpg'))
        .attach('image', path.resolve(__dirname, './images/image1.jpg'));
      expect(res.statusCode).toBe(200);
      expect(sellerToken).not.toBeNull();
    });

    test('should delete the product with the given ID', async () => {
      const res = await request(app)
        .delete(`/api/v1/products/${item.id}`)
        .set('Authorization', `Bearer ${sellerToken}`);
      expect(res.status).toBe(200);
    });
    test('should return 404 when product is not found', async () => {
      const res = await request(app)
        .delete(`/api/v1/products/9974076f-e16a-486f-a923-362ec1747a12`)
        .set('Authorization', `Bearer ${sellerToken}`);
      expect(res.status).toBe(404);
    });

    test('should return 404 if the product with the given ID does not exist', async () => {
      const res = await request(app)
        .delete(
          '/api/v1/products/products/9974076f-e16a-486f-a923-362ec1747a12'
        )
        .set('Authorization', `Bearer ${sellerToken}`);
      expect(res.status).toBe(404);
    });
    it('should return 401 status code if user is not authenticated', async () => {
      const response = await request(app)
        .patch(`/api/v1/products/${item.id}`)
      expect(response.status).toBe(401);
    });
  });
});

describe('Search products endpoint', () => {
  let products;
  beforeAll(async () => {
    // Set up test data
    const createUser = User.create({
      firstname: 'myfirstname',
      lastname: 'mysecondname',
      email: 'test@gmail.com',
      password: 'testpass2345',
    });
    products = await Products.bulkCreate([
      {
        name: 'Product 1',
        price: 10.0,
        quantity: 5,
        expiryDate: new Date('2022-01-01'),
      },
      {
        name: 'Product 2',
        price: 20.0,
        quantity: 10,
        expiryDate: new Date('2023-01-01'),
      },
      {
        name: 'Product 3',
        price: 30.0,
        quantity: 15,
        expiryDate: new Date('2023-01-01'),
      },
    ]);
  });
  let UserToken;
  test('should return all products when no filters are specified', async () => {
    const user = await User.findOne({ where: { email: 'test@gmail.com' } });
    UserToken = generateToken(user);
    const response = await request(app)
      .get('/api/v1/products/search')
      .set('Authorization', `Bearer ${UserToken}`);
    expect(response.status).toBe(200);
  });

  test('should filter products by name', async () => {
    const response = await request(app)
      .get('/api/v1/products/search?name=Product 1')
      .set('Authorization', `Bearer ${UserToken}`);
    expect(response.status).toBe(200);
  });

  test('should filter products by price range', async () => {
    const response = await request(app)
      .get('/api/v1/products/search?minPrice=10&maxPrice=20')
      .set('Authorization', `Bearer ${UserToken}`);
    expect(response.status).toBe(200);
  });

  test('should filter products by price categoryId', async () => {
    const response = await request(app)
      .get('/api/v1/products/search?catego')
      .set('Authorization', `Bearer ${UserToken}`);
    expect(response.status).toBe(200);
  });

  test('should filter products by price bestBefore', async () => {
    const response = await request(app)
      .get('/api/v1/products/search?bestBefore=2023-01-01')
      .set('Authorization', `Bearer ${UserToken}`);
    expect(response.status).toBe(200);
  });
  test('should filter products by price bestBefore', async () => {
    const response = await request(app)
      .get('/api/v1/products/search?bestBefore=07-2009')
      .set('Authorization', `Bearer ${UserToken}`);
    expect(response.status).toBe(400);
  });
});
describe('Rating and feedback for a product', () => {
  let product;
  let buyerToken;
  let user;
  let orderId;
  let saleId;


  beforeAll(async () => {
    const newUser = User.create({
      firstname: 'mysurname',
      lastname: 'mylastname',
      email: 'testbuyer@gmail.com',
      password: 'testbuyer2345',
    });
    product = await Products.create({
      name: 'Product 1',
      price: 47.0,
      quantity: 20,
      expiryDate: new Date('2023-02-01'),
    });
  });

  test('should allow a user to submit a rating and feedback for a product if they have purchased it', async () => {
    const user = await User.findOne({ where: { email: 'testbuyer@gmail.com' } });
    buyerToken = generateToken(user);
    const product = await Products.create({ name: 'Test Product', price: 10 });
    const order = await Orders.create({ userId: user.id, productId: product.id });
    const sale = await Sales.create({ orderId: order.id, status: 'approved' });
    const res = await request(app)
      .post(`/api/v1/products/${product.id}/reviews`)
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ rating: 4, feedback: 'This product is great!' });
    expect(res.status).toBe(201);
    const response = await request(app)
    .post(`/api/v1/products/${product.id}/reviews`)
    .set('Authorization', `Bearer ${buyerToken}`)
    .send({rating:3, feedback:'This product is great!'});
  expect(response.status).toBe(400);
  });
  test('should return 401 status code if user is not a buyer', async () => {
    product = await Products.findOne({ where: { name: 'Product 1' } });
    const sellerToken = generateToken(user);
    const response = await request(app)
      .post(`/api/v1/products/${product.id}/reviews`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({rating:3, feedback:'This product is great!'});
    expect(response.status).toBe(401);
  });
  test('should return 404 status code if product to review is not found', async () => {
    const buyer = await User.findOne({ where: { email: 'testbuyer@gmail.com' } });
    buyerToken = generateToken(buyer);
    const res = await request(app)
      .post('/api/v1/products/9974076f-e16a-486f-a923-362ec1747a12/reviews')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ rating: 4, feedback: 'This product is great!' });
      expect(res.status).toBe(404);
  }); 
  test('should return 400 if feedback is not provided', async () => {
    const response = await request(app)
      .post(`/api/v1/products/${product.id}/reviews`)
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({
        rating: 4,
      });
    expect(response.status).toBe(400);
  });
  test('should return 400 if rating is not provided', async () => {
    const response = await request(app)
      .post(`/api/v1/products/${product.id}/reviews`)
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({
        feedback: 'Some feedback',
      });
    expect(response.status).toBe(400);
  });
  test('should return 401 status code if user is not a buyer', async () => {
    product = await Products.findOne({ where: { name: 'Product 1' } });
    const sellerToken = generateToken(user);
    const response = await request(app)
      .get(`/api/v1/products/${product.id}/reviews`)
      .set('Authorization', `Bearer ${sellerToken}`)
    expect(response.status).toBe(401);
  });
  test('should return 404 status code if no reviews', async () => {
    product = await Products.findOne({ where: { name: 'Product 1' } });
    const response = await request(app)
      .get(`/api/v1/products/${product.id}/reviews`)
      .set('Authorization', `Bearer ${buyerToken}`)
    expect(response.status).toBe(404);
  });
});