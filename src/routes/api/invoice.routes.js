import express from 'express';
import {
  getAllInvoices,
  getInvoiceById,
  getUserInvoices,
} from '../../controllers/invoice.controller';
import extractToken from '../../middlewares/checkUserWithToken';

const route = express.Router();

// Retrieve all invoices
route.get('/invoices', getAllInvoices);

// Retrieve a single invoice by ID
route.get('/invoices/:id', getInvoiceById);

// Retrieve invoices for a specific user
route.get('/user/invoices', extractToken, getUserInvoices);

export default route;
