import { Sales, Orders } from '../database/models';

export const trackOrderStatus = async (req, res) => {
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

export const getOrders = async (req, res) => {
  const buyerId = req.user.id;
  const role = req.user.role;
  const allOrders = await Orders.findAll({ where: { userId: buyerId } });
  const orders = await Orders.findAll({});
  if (role == 'admin') {
    return res.status(200).json({ Orders: orders });
  }
  if (allOrders.length === 0) {
    return res.status(404).json({ message: 'You have no order yet' });
  }
  return res.status(200).json({ Orders: allOrders });
};
