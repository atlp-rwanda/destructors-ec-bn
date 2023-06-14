import express from 'express';
import {
  createInvoice,
  getInvoiceById,
  getAllInvoices,
} from '../../controllers/invoice.controller';

const route = express.Router();

// Route for generating an invoice
route.post('/invoices', createInvoice);

// Route for retrieving an invoice by ID
route.get('/invoices/:id', getInvoiceById);

// Route for retrieving all invoices
route.get('/invoices', getAllInvoices);

export default route;
