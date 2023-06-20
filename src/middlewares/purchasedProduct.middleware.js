import { Orders } from '../database/models';
const checkIfOrderIsApproved = async (req, res, next) => {
  try {
    const order = await Orders.findOne({
      where: { userId: req.user.id, status: 'payed' },
    });
    if (!order) {
      return res.status(400).json({
        message: 'You must purchase this product before reviewing it.',
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong.',
    });
  }
};
export default checkIfOrderIsApproved;
