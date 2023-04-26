import { Sales, Orders } from '../database/models';

const trackOrderStatus = async (req, res) => {
  try {
    const buyerId = req.user.id;
    const selectedOrder = await Orders.findOne({
      where: {
        id: req.params.id,
        userId: buyerId,
      },
    });
    const selectedSale = await Sales.findOne({
      where: {
        orderId: req.params.id,
      },
    });
    if (!selectedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (!selectedSale) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    const orderStatus = selectedSale.status;
    return res.status(200).json({ orderStatus });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, error: error });
  }
};

export default trackOrderStatus;
