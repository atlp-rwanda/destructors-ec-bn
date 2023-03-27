import { where } from 'sequelize';
import { Cart } from '../database/models';
import { findProductById } from './product.service';

const createCart = (cart) => {
  return Cart.create(cart);
};

const getCart = async (userId) => {
  return Cart.findOne({ where: { userId: userId } });
};

const updateCart = async (fields, cartId) => {
  return Cart.update({ ...fields }, { where: { id: cartId } });
};

const getCartProducts = async (products) => {
  return Promise.all(
    products.map(async (product) => {
      return await findProductById(product);
    })
  );
};

export { createCart, getCart, updateCart, getCartProducts };
