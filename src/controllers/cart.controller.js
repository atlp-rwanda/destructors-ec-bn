import { createCart, updateCart } from '../services/cart.service';
import { findProductById } from '../services/product.service';
import { getCartProducts } from '../services/cart.service';
import culculateProductTotal from '../utils/cart';

const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    let cart = req.cart;

    let { productId } = req.body;
    let productQuantity = req.body.productQuantity || 1;

    const product = await findProductById(productId);

    if (!product)
      return res.status(400).json({ message: "Product does'nt exist" });
    if (product.quantity < productQuantity) {
      return res
        .status(400)
        .json({ message: 'No enough product in the stock' });
    }

    if (!cart) {
      const products = [
        {
          quantity: productQuantity,
          productId: productId,
          sellerId: product.sellerId,
        },
      ];

      const newCarts = {
        userId,
        products,
      };

      cart = await createCart(newCarts);
    }
    return res.status(201).json({
      id: productId,
      sellerId: product.sellerId,
      quantity: productQuantity,
      message: 'Product added to cart successfully ',
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: 'Something went wrong while adding product to cart',
    });
  }
};

const viewCart = async (req, res) => {
  try {
    const cart = req.cart;
    if (!cart)
      return res
        .status(404)
        .json({ message: 'Your cart is empty, Create a new cart' });
    const { products } = cart;
    const pId = products.map((product) => product.productId);
    const productInfo = await getCartProducts(pId);

    const productAllInfo = productInfo.map((product, index) => ({
      name: product.name,
      price: product.price,
      quantity: products[index].quantity,
      images: product.images,
      sellerId: product.sellerId,
    }));
    const cartTotal = culculateProductTotal(productAllInfo);
    return res.status(200).json({
      id: cart.id,
      product: productAllInfo,
      total: cartTotal,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      message: 'something went wrong while processing cart',
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = req.cart;
    cart.products = [];
    await updateCart({ products: cart.products }, cart.id);
    return res
      .status(200)
      .json({ id: cart.id, message: 'cart is successfully cleared' });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      message: 'something went wrong while clearing the cart',
    });
  }
};

export { addToCart, viewCart, clearCart };
