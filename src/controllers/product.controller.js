/* eslint-disable object-curly-newline */
import { createProduct } from '../services/product.service.js';
const createProducts = async (req, res) => {
  try {
    const { name, price, quantity, bonus, expiryDate, categoryId } = req.body;
    const images = req.files.map((img) => img.path);
    const userId = req.user.id;
    const productDetails = {
      name,
      price,
      quantity,
      bonus,
      expiryDate,
      categoryId,
      userId,
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

export { createProducts };
