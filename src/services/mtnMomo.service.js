import axios from 'axios';
import { generateAuthToken } from '../utils/authUtils';

const initiatePayment = async (amount, currency, orderId, phoneNumber) => {
  const paymentData = {
    amount,
    currency,
    externalId: orderId,
    payer: {
      partyIdType: 'MSISDN',
      partyId: phoneNumber,
    },
    payerMessage: `Payment for order ${orderId}`,
    payeeNote: `Payment for order ${orderId}`,
  };
  const authHeaders = {
    Authorization: `Bearer ${generateAuthToken()}`,
  };

  try {
    const response = await axios.post(paymentData, { headers: authHeaders });
    const paymentStatus = response.data.status;
    console.log('Payment status:', paymentStatus);
  } catch (error) {
    const errorMessage = error.response.data.message;
    console.error('Error:', errorMessage);
    throw new Error(errorMessage);
  }
};

export { initiatePayment };
