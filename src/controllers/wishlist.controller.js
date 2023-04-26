import { createAwish } from '../services/addToWishList.service';
import { Products, User, ProductWish } from '../database/models';
import verfyToken from '../utils/verifytoken';
const { sequelize } = require('../database/models');
import { sendEmail } from '../services/sendEmail.service';
import { eventEmitter } from '../events/eventEmitter';

const addWishlist = async (req, res) => {
  try {
    const token = req.header('Authorization').split(' ')[1];
    const userVerify = verfyToken(token, process.env.JWT_SECRET);

    if (!req.user) {
      return res.status(401).json({ message: 'unauthorized user!' });
    }

    const { productId } = req.body;
    const product = await Products.findByPk(productId);

    if (!product) {
      return res.status(400).json({ message: 'product not found' });
    }
    if (!userVerify.data.id) {
      return res.status(401).json({ message: 'not permited!' });
    }

    const wishes = await ProductWish.findOne({
      where: { productId, userId: userVerify.data.id },
    });
    if (wishes) {
      await wishes.destroy();
      return res
        .status(200)
        .json({ message: 'product unwished  succesfully!' });
    }
    if (userVerify.data.role === 'buyer') {
      const wishedItem = {
        userId: userVerify.data.id,
        productId: product.id,
      };
      await createAwish(wishedItem);

      const wish = await ProductWish.findOne({
        where: { userId: userVerify.data.id, productId: product.id },
      });
      const wishProduct = await Products.findOne({
        include: [{ model: User, as: 'Seller' }],
        where: { id: wishedItem.productId },
      });
      const subject = 'Product wishes';
      const message = `Hi ${wishProduct.Seller.lastname}, you have a new wish on ${wishProduct.name} `;
      const HTMLText = `<div> <div> <h3 style="color:#81D8F7;">Products wished</h3><br><p>${message}</p><img src="${wishProduct.images[0]}"> </div> </div>`;
      const notificationDetails = {
        receiver: wishProduct.Seller.id,
        subject,
        message,
        entityId: { productWishId: wish.id },
        receiverId: wishProduct.Seller.id,
      };
      eventEmitter.emit('wish-notification', notificationDetails);

      sendEmail(wishProduct.Seller.email, subject, HTMLText);

      return res.status(201).json({
        message: 'product wished created successfull',
        wishedItemCreate: wishedItem,
      });
    } else {
      return res.status(200).json({ message: 'only buyer are allowed!' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'something went wrong!',
    });
  }
};
const getProductWished = async (req, res) => {
  try {
    const token = req.header('Authorization').split(' ')[1];
    const user = verfyToken(token, process.env.JWT_SECRET);

    if (!user) {
      return res.status(400).json({ message: 'unauthorized user !' });
    }
    let productWishes;
    if (user.data.role === 'buyer') {
      productWishes = await ProductWish.findAll({
        where: { userId: user.data.id },
      });
    } else if (user.data.role === 'seller') {
      const sellerId = user.data.id;
      productWishes = await ProductWish.findAll({
        attributes: [
          'productId',
          [sequelize.fn('count', sequelize.col('productId')), 'count'],
        ],

        include: [
          {
            model: Products,
            as: 'Product',
            where: { sellerId },
            attributes: [],
          },
        ],
        group: ['productId'],
      });
    } else {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.status(200).json({ productWishes });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
const getWishesPerProduct = async (req, res) => {
  try {
    const token = req.header('Authorization').split(' ')[1];
    const user = verfyToken(token, process.env.JWT_SECRET);

    if (!user || user.data.role !== 'seller') {
      return res.status(401).json('unAuthorized user !');
    }
    const { id: productId } = req.params;
    const sellerId = user.data.id;
    const productWishes = await ProductWish.findAll({
      attributes: [
        'productId',
        [sequelize.fn('count', sequelize.col('productId')), 'count'],
      ],
      include: [
        {
          model: Products,
          as: 'Product',
          where: { sellerId, id: productId },
          attributes: [],
        },
      ],
      group: ['productId'],
    });
    if (!productId) {
      res.status(200).send('product wish not found!');
    }
    return res.status(200).json(productWishes);
  } catch (error) {
    res.status(500).json(error);
  }
};

export { addWishlist, getProductWished, getWishesPerProduct };
