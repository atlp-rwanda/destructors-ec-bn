import { Orders, User } from '../database/models';
import { sendInvoiceEmail } from '../services/invoice.service';
import sgMail from '@sendgrid/mail';
import 'dotenv/config';

const apiKey = process.env.API_KEY;
sgMail.setApiKey(apiKey);

// Retrieve all invoices
export async function getAllInvoices(req, res) {
  try {
    const invoices = await Orders.findAll({
      include: {
        model: User,
        attributes: ['firstname', 'lastname', 'email', 'billingAddress'],
      },
      attributes: ['id', 'amount', 'status', 'products'],
    });

    const mappedInvoices = invoices.map((invoice) => {
      const {
        id,
        amount,
        status,
        products,
        User: { firstname, lastname, email, billingAddress },
      } = invoice;

      return {
        id,
        amount,
        status,
        products,
        user_details: {
          firstname,
          lastname,
          email,
          billingAddress,
        },
      };
    });

    // Send invoice email for each order
    mappedInvoices.forEach((invoice) => {
      sendInvoiceEmail(invoice);
    });

    res.json(mappedInvoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Retrieve a single invoice by ID
export async function getInvoiceById(req, res) {
  const { id } = req.params;
  try {
    const invoice = await Orders.findOne({
      where: { id },
      include: {
        model: User,
        attributes: ['firstname', 'lastname', 'email', 'billingAddress'],
      },
      attributes: ['id', 'amount', 'status', 'products'],
    });

    if (invoice) {
      const {
        id,
        amount,
        status,
        products,
        User: { firstname, lastname, email, billingAddress },
      } = invoice;

      const mappedInvoice = {
        id,
        amount,
        status,
        products,
        user_details: {
          firstname,
          lastname,
          email,
          billingAddress,
        },
      };

      res.json(mappedInvoice);
    } else {
      res.status(404).json({ message: 'Invoice not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Retrieve invoices for a specific user
export async function getUserInvoices(req, res) {
  const userId = req.user.id;
  try {
    const invoices = await Orders.findAll({
      where: { userId },
      include: {
        model: User,
        attributes: ['firstname', 'lastname', 'email', 'billingAddress'],
      },
      attributes: ['id', 'amount', 'status', 'products'],
    });

    // Map invoices to include only necessary fields from user and order tables
    const mappedInvoices = invoices.map((invoice) => {
      const {
        id,
        amount,
        status,
        products,
        User: { firstname, lastname, email, billingAddress },
      } = invoice;

      return {
        id,
        amount,
        status,
        products,
        user_details: {
          firstname,
          lastname,
          email,
          billingAddress,
        },
      };
    });

    res.json(mappedInvoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
