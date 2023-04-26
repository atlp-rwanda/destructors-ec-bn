import { Orders } from '../database/models';
import { Cart } from '../database/models';
export const createOrder = (
  paymentId,
  userId,
  email,
  cartTotal,
  productAllInfo,
  billingAddress
) => {
  return Orders.create({
    paymentId: paymentId,
    userId: userId,
    email: email,
    amount: cartTotal,
    products: productAllInfo,
    billingAddress: billingAddress,
  });
};

export const destroyCart = async (id) => {
  return Cart.destroy({ where: { id: id } });
};
