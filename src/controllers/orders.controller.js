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

const getOrders = async (req, res) => {
  const buyerId = req.user.id;
  const role = req.user.role;
  const condition = role === 'admin' ? {} : { userId: buyerId };
  const allOrders = await Orders.findAll({ where: condition });
  if (allOrders.length === 0) {
    return res.status(404).json({ message: 'You have no order yet' });
  }
  return res.status(200).json({ Orders: allOrders });
};

const getSales = async (req, res) => {
  const sellerId = req.user.id;
  const allOrders = await Orders.findAll({
    attributes: ['products', 'id', 'amount'],
  });
  let allSellerOrders = [];

  for (const order of allOrders) {
    if (order.products === null) {
      continue;
    }

    const filteredProducts = order.products.filter(
      (element) => element.sellerId === sellerId
    );
    allSellerOrders.push({
      id: order.id,
      amount: order.amount,
      products: filteredProducts,
    });
  }

  if (allSellerOrders.length === 0) {
    return res.status(404).json({ message: 'You have no sale yet' });
  }

  return res.status(200).json({ Orders: allSellerOrders });
};

export { trackOrderStatus, getOrders, getSales };
