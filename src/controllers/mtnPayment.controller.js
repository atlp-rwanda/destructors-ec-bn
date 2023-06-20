import { calculateTotalAmount } from '../utils/paymentUtils';
import { initiatePayment } from '../services/mtnMomo.service';

const checkout = async (req, res) => {
  const { products } = req.body;
  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: 'Invalid products data.' });
  }

  for (const product of products) {
    if (typeof product.name !== 'string' || typeof product.price !== 'number') {
      return res.status(400).json({ error: 'Invalid product data.' });
    }
  }

  try {
    const totalAmount = calculateTotalAmount(products);
    const recipientId = 'recipient_id';

    await initiatePayment(totalAmount, 'USD', recipientId);

    console.log('Payment successful');
    res.status(200).json({ message: 'Payment successful' });
  } catch (error) {
    console.error('Payment failed:', error.message);

    res.status(500).json({ error: 'Payment failed' });
  }
};

export { checkout };
