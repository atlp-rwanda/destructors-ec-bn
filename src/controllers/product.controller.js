/* eslint-disable object-curly-newline */
import { createProduct } from '../services/product.service.js';

const createProducts = async (req, res) => {
  try {
    const { name, price, quantity, bonus, expiryDate, categoryId, images } =
      req.body;

    // const sellerId = req.user.id;
    const userId = '9500aeaa-745d-4df5-b0a5-947c63d80e57';
    //   const  image = cloudinary stuff needed here

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
    return res
      .status(201)
      .json({
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
