// eslint-disable-next-line import/extensions
import { Sale, Orders } from '../database/models';
// eslint-disable-next-line import/order
import Stripe from 'stripe';

const stripe = Stripe(process.env.KEY_SECRET);
const createSale = async (orderId, sellerId) => Sale.create({
  orderId,
  sellerId
});

const findOrderDetails = async (id) => {
  const data = await Orders.findOne({ where: { paymentId: id } });
  return data;
};

const createCheckout = async (linedata) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    shipping_address_collection: { allowed_countries: ['RW', 'TZ', 'KE', 'BJ', 'UG'] },
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 0, currency: process.env.CURRENCY },
          display_name: 'Free shipping',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 3 },
            maximum: { unit: 'business_day', value: 5 },
          },
        },
      },
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 1500, currency: process.env.CURRENCY },
          display_name: 'Next day with air',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 1 },
            maximum: { unit: 'business_day', value: 1 },
          },
        },
      },
    ],
    phone_number_collection: {
      enabled: true,
    },
    line_items: linedata,
    mode: 'payment',
    success_url: 'http://localhost:3000/api/v1/success?paymentId={CHECKOUT_SESSION_ID}',
    cancel_url: 'http://localhost:3000/cancel'
  });
  return session;
};
export { findOrderDetails, createSale, createCheckout };
