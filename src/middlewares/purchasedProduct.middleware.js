import { Orders, Sales } from '../database/models';

const checkIfOrderIsApproved = async (req, res, next) => {
    try {
        const order = await Orders.findOne({
          where: { userId: req.user.id }
        });
        if (!order) {
          return res.status(400).json({
            message: 'You must purchase this product before reviewing it.'
          });
        }
        const sale = await Sales.findOne({
          where: { orderId: order.id }
        });
        if (!sale || sale.status !== 'approved') {
          return res.status(400).json({
            message: 'You must complete the purchase before reviewing the product.'
          });
        }
        next();
      } catch (error) {
        res.status(500).json({
          message: 'Something went wrong.'
        });
      }
};

export default checkIfOrderIsApproved;
