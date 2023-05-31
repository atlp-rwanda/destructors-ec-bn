import { createCart, getCart, updateCart } from '../services/cart.service';
import { findProductById } from '../services/product.service';

const getUserCart = async (req, res, next) => {
  const userId = req.user.id;
  const userCart = await getCart(userId);
  req.cart = userCart;
  next();
};

const addProductToCart = async (req, res, next) => {
  const cart = req.cart;
  const { productId } = req.body;

  const productQuantity = req.body.productQuantity || 1;

  if (!cart) {
    return next();
  }

  const products = cart.products;
  const existProducts = products.find((p) => p.productId === productId);
  if (existProducts) {
    const newQuantity = existProducts.quantity + productQuantity;
    const product = await findProductById(productId);
    if (product.quantity >= newQuantity) {
      existProducts.quantity = newQuantity;
      await updateCart({ products: cart.products }, cart.id);
    } else {
      return res
        .status(400)
        .json({ message: 'No enough product in the stock' });
    }
  } else {
    const newProduct = {
      quantity: productQuantity,
      productId: productId,
    };
    cart.products.push(newProduct);
    await updateCart({ products: cart.products }, cart.id);
  }
  req.cart = cart;
  next();
};
const isProductAvailable = async (req, res, next) => {
  const { productId } = req.body;
  const product = await findProductById(productId);
  if (!product)
    return res.status(400).json({ message: 'this product is not exist' });

  if (!product.isAvailable) {
    return res
      .status(400)
      .json({ message: 'This is product is not Available' });
  }
  next();
};

const isProductExpired = async (req, res, next) => {
  const { productId } = req.body;
  const product = await findProductById(productId);
  if (!product)
    return res.status(400).json({ message: 'this product is not exist' });

  if (product.isExpired) {
    return res.status(400).json({ message: 'This is product is expired' });
  }
  next();
};

const checkProductInCart = async (req, res, next) => {
  const cart = req.cart;
  let { productId } = req.params;
  if (!cart) {
    return next();
  }
  const products = cart.products;
  const existingProduct = products.find((p) => p.productId === productId);
  if (!existingProduct) {
    return res.status(404).json({ message: 'Product not in cart' });
  }
  next();
};

export {
  getUserCart,
  addProductToCart,
  isProductExpired,
  isProductAvailable,
  checkProductInCart,
};
