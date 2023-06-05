/* eslint-disable object-curly-newline */
import {
  createProduct,
  findAllProducts,
  findProduct,
  findProducts
} from '../services/product.service.js';
import verfyToken from '../utils/verifytoken.js';
import 'dotenv/config';
import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';

import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import User, { Products } from '../database/models';
import { generateToken } from '../utils/generateToken';
import { eventEmitter } from '../events/eventEmitter.js';

const createProducts = async (req, res) => {
  try {
    const { name, price, quantity, bonus, expiryDate, categoryId, description } = req.body;
    const images = req.files.map((img) => img.path);
    const sellerId = req.user.id;
    const productDetails = {
      name,
      description,
      price,
      quantity,
      bonus,
      expiryDate,
      categoryId,
      sellerId,
      images,
    };

    const product = await createProduct(productDetails);
    return res.status(201).json({
      message: 'Products created successfull',
      product: productDetails,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: err.message, message: 'Something went wrong' });
  }
};

const retrieveItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const token = req.header('Authorization').split(' ')[1];
    const user = verfyToken(token, process.env.JWT_SECRET);

    if (user.data.role == 'seller') {
      const item = await findProduct(itemId, 'seller', user.data.id);

      if (!item) {
        return res
          .status(404)
          .json({ message: 'This product is not found in your collection' });
      }

      return res.status(200).json({ item });
    }

    if (user.data.role == 'buyer') {
      const item = await findProduct(itemId);

      if (!item) {
        return res.status(404).json({ message: 'This product is not found' });
      }
      return res.status(200).json({ item });
    }

    if (user.data.role == 'admin') {
      const item = await findProduct(itemId, 'admin');

      if (!item) {
        return res.status(404).json({ message: 'This product is not found' });
      }
      return res.status(200).json({ item });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const retrieveItems = async (req, res) => {
  try {
    const token = req.header('Authorization').split(' ')[1];
    const user = verfyToken(token, process.env.JWT_SECRET);
    const pageAsNumber = Number.parseInt(req.query.page);
    const sizeAsNumber = Number.parseInt(req.query.size);

    let page = 0;
    if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
      page = pageAsNumber;
    }

    let size = 10;
    if (
      !Number.isNaN(sizeAsNumber)
      && !(sizeAsNumber > 10)
      && !(sizeAsNumber < 1)
    ) {
      size = sizeAsNumber;
    }

    if (user.data.role == 'seller') {
      const items = await findProducts('seller', user.data.id, '', size, page);
      if (items.rows.length === 0) {
        return res.status(200).json({ message: 'The collection is empty' });
      }

      return res
        .status(200)
        .json({
          items: items.rows,
          totalPages: Math.ceil(items.count / Number.parseInt(size)),
        });
    }

    if (user.data.role == 'buyer' || user.data.role == 'admin') {
      const items = await findProducts('', '', false, size, page);

      if (items.length === 0) {
        return res.status(200).json({ message: 'The store is empty' });
      }
      return res
        .status(200)
        .json({
          items: items.rows,
          totalPages: Math.ceil(items.count / Number.parseInt(size)),
        });
    }
  } catch (error) {
    res.status(500).json('Server Error');
  }
};

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const UserData = await User.User.findOne({
        where: { email: jwt_payload.data.email },
      });
      if (!UserData) {
        return done(null, false);
      }
      return done(null, UserData);
    } catch (error) {
      done(error, false);
    }
  })
);

const searchProducts = async (req, res) => {
  try {
    passport.authenticate('jwt', { session: false }, async (err, UserData) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      try {
        const { name, minPrice, maxPrice, categoryId, bestBefore } = req.query;

        const where = {};
        if (name) where.name = { [Op.iLike]: `%${name}%` };
        if (minPrice) where.price = { [Op.gte]: minPrice };
        if (maxPrice) where.price = { ...where.price, [Op.lte]: maxPrice };
        if (categoryId) where.categoryId = categoryId;
        let expiryDate;
        if (bestBefore) {
          expiryDate = new Date(bestBefore);
          if (isNaN(expiryDate)) {
            return res.status(400).json({ error: 'Invalid date format for bestBefore' });
          }
          where.expiryDate = { [Op.lt]: expiryDate };
        }

        if (UserData.role == 'seller') {
          where.sellerId = UserData.id;
        }

        const products = await Products.findAll({ where });
        return res.status(200).json({ products });
      } catch (err) {
        return res.status(500).json({ error: 'enter valid uuid' });
      }
    })(req, res);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const updateProductAvailability = async (req, res) => {
  try {
    passport.authenticate(
      'jwt',
      { session: false },
      async (err, sellerData) => {
        if (err) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!sellerData) {
          return res
            .status(400)
            .json({ error: 'Enter your credentials as seller' });
        }

        if (sellerData.role !== 'seller') {
          return res
            .status(400)
            .json({
              error: 'Only seller users can update product availability',
            });
        }

        const productId = req.params.id;
        // Regular expression to check if string is a valid UUID

        const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
        const verifyId = regexExp.test(productId);
        if (!verifyId) {
          return res.status(400).json({ error: 'Insert a valid uuid' });
        }
        const product = await Products.findOne({ where: { id: productId } });

        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }

        if (product.sellerId !== sellerData.id) {
          return res
            .status(401)
            .json({ error: 'You are not authorized to update this product' });
        }

        const updatedIsAvailable = !product.isAvailable;
        const updateProduct = await Products.update(
          { isAvailable: updatedIsAvailable },
          { where: { id: productId } }
        );
        const updatedProduct = await Products.findOne({
          where: { id: productId },
        });
        if (updatedProduct.isAvailable) {
          const userId = [];
          const user = await User.User.findAll({
            where: { role: 'buyer' },
            attributes: ['id']
          });
          user.map((element) => {
            userId.push(element.id);
          });
          const notificationDetails = {
            receiver: 'buyer',
            subject: 'New product',
            message: `Have your eyes on this 🤩 ${updatedProduct.name}`,
            entityId: { productId: updatedProduct.id },
            productImage: updatedProduct.images[0],
            receiverId: userId
          };
          eventEmitter.emit('new-notification', notificationDetails);
          return res.status(200).json({ product: updatedProduct, user: userId });
        }

        return res.status(200).json({ product: updatedProduct });
      }
    )(req, res);
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, quantity, categoryId, bonus, expiryDate } = req.body;
  try {
    const product = await Products.findOne({
      where: { id, sellerId: req.user.id },
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const currentImages = product.images;
    let newImages = [];
    const updatedProduct = {
      name: name || product.name,
      price: price || product.price,
      quantity: quantity || product.quantity,
      categoryId: categoryId || product.categoryId,
      bonus: bonus || product.bonus,
      expiryDate: expiryDate || product.expiryDate,
      images: currentImages,
    };
    if (req.files && req.files.length > 0) {
      newImages = req.files.map((file) => file.path);
      updatedProduct.images = newImages;
    }
    await product.update(updatedProduct);
    const finalProduct = await Products.findOne({ where: { id } });
    if (newImages.length > 0) {
      finalProduct.images = updatedProduct.images;
    }
    return res
      .status(200)
      .json({ message: 'Product updated successfully', product: finalProduct });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const sellerId = req.user.id;

  try {
    const product = await Products.findOne({
      where: { id, sellerId },
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.destroy();

    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
};

const retrieveAllProducts = async (req, res) => {
  try {
    const pageAsNumber = Number.parseInt(req.query.page);
    const sizeAsNumber = Number.parseInt(req.query.size);

    let page = 0;
    if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) {
      page = pageAsNumber;
    }

    let size = 10;
    if (
      !Number.isNaN(sizeAsNumber)
      && !(sizeAsNumber > 10)
      && !(sizeAsNumber < 1)
    ) {
      size = sizeAsNumber;
    }
    const products = await findAllProducts(size, page);
    return res
      .status(200)
      .json({
        products: products.rows,
        totalPages: Math.ceil(products.count / Number.parseInt(size)),
      });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
};

export {
  createProducts,
  updateProductAvailability,
  updateProduct,
  deleteProduct,
  retrieveItem,
  retrieveItems,
  searchProducts,
  retrieveAllProducts
};
