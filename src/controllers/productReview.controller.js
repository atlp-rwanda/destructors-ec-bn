import { findProductById, productReview } from '../services/product.service';
import { calculateAverageRating } from '../utils/averageRating';
import { Reviews } from '../database/models';
const createProductReview = async (req, res) => {
  const { id: productId } = req.params;
  const buyerId = req.user.id;
  const { rating, feedback } = req.body;
  try {
    const product = await findProductById(productId);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    const existingReview = await Reviews.findOne({
      where: {
        buyerId,
        productId,
      },
    });
    if (existingReview) {
        return res.status(400).json({ message: 'You have already reviewed this product' });
      }
    const review = await productReview(productId, buyerId, rating, feedback);

    const reviews = await Reviews.findAll({ where: { productId } });
    const averageRating = calculateAverageRating(reviews);

    await product.update({ averageRating });

    res.status(201).json({
      message: 'Product reviewed successfully',
      review,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { createProductReview };

