/* eslint-disable array-callback-return */
/* eslint-disable import/extensions */
import Stripe from 'stripe';
import 'dotenv/config';
import culculateProductTotal from '../utils/cart';
import { createOrder, destroyCart } from '../middlewares/payment.middleware';
import { findOrderDetails, createCheckout } from '../middlewares/sale.middleware';
import { Sales } from '../database/models';
import { findUserById } from '../services/user.service';
import { eventEmitter } from '../events/eventEmitter';
import { sendEmail } from '../services/sendEmail.service'

const stripe = Stripe(process.env.KEY_SECRET);
let paymentId;
const userPayment = async (req, res) => {
  try {
    let data;
    const carts = req.cart;
    const cartId = carts.id;
    const { email, firstname, id } = req.user;
    const { productAllInfo } = req;
    const products = productAllInfo;
    // eslint-disable-next-line no-shadow
    const productInfo = products.map((data) => ({
      name: data.name,
      quantity: data.quantity,
      images: data.image,
      price: data.price,
      total: (data.quantity * data.price)
    }));
    const cartTotal = culculateProductTotal(productAllInfo);
    const lineData = productInfo.map((item) => ({
      price_data: {
        currency: process.env.CURRENCY,
        product_data: {
          name: item.name,
          description: item.quantity,
          images: item.images,
        },
        unit_amount: cartTotal,
      },
      quantity: item.quantity,
    }));
    await stripe.customers.create({
      email,
      name: firstname
    })
      .then(async () => {
        const session = await createCheckout(lineData);
        paymentId = session.id;
        await createOrder(paymentId, id, email, cartTotal, productAllInfo);
        await destroyCart(cartId);
        res.status(201).json({ payment_link: session.url });
      });
  } catch (e) {
    res.status(500).json({ message: 'Some thing happened !!', err: e.raw.message });
  }
};
const stripesuccess = async (req, res) => {
  try {
    const { paymentId } = req.query;
    const session = await stripe.checkout.sessions.retrieve(
      paymentId
    );
    const findOrderId = await findOrderDetails(paymentId);
    const orderId = findOrderId.id;
    const orderProducts = findOrderId.products;
    const sellerIds = [];
    orderProducts.map((data) => {
      sellerIds.push(data.sellerId);
    });
    for (const sellerId of sellerIds) {
      const p = await Sales.create({
        orderId,
        sellerId
      });
    }

    const subject = 'New Order';
    sellerIds.forEach(async (element) => {
      const sellerDetails = await findUserById(element);
      orderProducts.forEach(async (data) =>{
        if (sellerDetails && data.sellerId == element) {
          const message = `Hi ${sellerDetails.lastname}, you have a new order on ${data.name}.`
          const HTMLText = `<div> <div> <h3 style="color:#81D8F7;">New Status</h3><br><p>${message}<br>Thank you<br><br>Destructors</p> </div> </div>`;
          const notificationDetails = {
            receiver: element,
            subject,
            message,
            entityId: { orderId },
            productImage: data.image,
            receiverId: element
          }
          eventEmitter.emit('newOrder-notification', notificationDetails);
          sendEmail(sellerDetails.email, subject, HTMLText);
        }
      })
    });

    res.status(201).json({message:'your order has been created successfully!!', order:orderId})
  } catch (error) {
    res.status(500).json({message: ' something went wrong',error})
  }
};
export { userPayment, stripesuccess };
