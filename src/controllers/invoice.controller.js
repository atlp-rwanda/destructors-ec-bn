const { Invoice } = require('../database/models');

const createInvoice = async (
  orderId,
  buyerId,
  orderDetails,
  buyerDetails,
  prices,
  quantities
) => {
  try {
    const invoiceData = {
      orderId,
      buyerId,
      orderDetails,
      buyerDetails,
      prices,
      quantities,
    };

    const invoice = await Invoice.create(invoiceData);
    return invoice;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
};

const getInvoiceById = async (invoiceId) => {
  try {
    const invoice = await Invoice.findByPk(invoiceId);
    return invoice;
  } catch (error) {
    console.error('Error retrieving invoice:', error);
    throw error;
  }
};

const getAllInvoices = async () => {
  try {
    const invoices = await Invoice.findAll();
    return invoices;
  } catch (error) {
    console.error('Error retrieving invoices:', error);
    throw error;
  }
};

module.exports = {
  createInvoice,
  getInvoiceById,
  getAllInvoices,
};
