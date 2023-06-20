import sgMail from '@sendgrid/mail';
import 'dotenv/config';

const apiKey = process.env.API_KEY;
sgMail.setApiKey(apiKey);

// Send invoice email
export function sendInvoiceEmail(invoice) {
  const { id, amount, status, products, user_details } = invoice;
  const { firstname, lastname, email, billingAddress } = user_details;

  const message = {
    to: email,
    from: process.env.SEND_EMAIL,
    subject: 'Invoice Payment Confirmation',
    html: `
      <html>
      <head>
 <style>
              /* General styles */
              body {
                  margin: 0;
                  padding: 0;
                  font-family: 'Lato', Arial, Helvetica, sans-serif;
                  -webkit-font-smoothing: antialiased;
                  background-color: #f1f1f1;
                  -webkit-text-size-adjust: none;
              }
      
              /* Header styles */
              .header {
                  background-color: #383e56;
                  text-align: center;
                  padding: 20px;
                  color: #fff;
              }
      
              .logo {
                  width: 220px;
                  height: 35px;
              }
      
              /* Content styles */
              .content {
                  text-align: center;
                  padding: 20px;
                  color: #45535C;
              }
      
              .title {
                  font-weight: 800;
                  font-size: 34px;
                  margin-bottom: 20px;
              }
      
              .subtitle {
                  font-weight: 800;
                  font-size: 18px;
                  margin-bottom: 20px;
              }
      
              .message {
                  font-size: 14px;
                  line-height: 1.4;
                  margin-bottom: 20px;
              }
      
              /* Invoice details styles */
              .invoice-details {
                  border-collapse: collapse;
                  width: 100%;
                  max-width: 640px;
                  margin: 0 auto;
              }
      
              .invoice-details th,
              .invoice-details td {
                  padding: 10px;
                  text-align: left;
              }
      
              .invoice-details th {
                  background-color: #f9f9f9;
                  color: #5a5a5a;
                  font-weight: bold;
              }
      
              .invoice-details td {
                  border-bottom: 1px solid #f1f1f1;
              }
      
              /* Footer styles */
              .footer {
                  text-align: center;
                  padding: 20px;
                  background-color: #f9f9f9;
                  color: #5a5a5a;
              }
          </style>
      </head>
      
      <body>
          <!-- Content -->
          <div class="content">
              <h1 class="title">Thanks for your order!</h1>
              <h2 class="subtitle">Dear ${firstname} ${lastname}</h2>
              <br>
              <h3>Order ID: ${id} </h3>

              <p class="message">
                  Here’s what you purchased
              </p>
      
              <!-- Invoice details -->

              <table class="invoice-details">

                  <thead>
                      <tr>
                          <th>Item</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Total</th>
                      </tr>
                  </thead>
                  <tbody>
  ${products
    .map(
      (product) => `
  <tr>
      <td>${product.name}</td>
      <td>${product.quantity}</td>
      <td>${product.price}</td>
      <td>${product.quantity * product.price}</td>
  </tr>`
    )
    .join('')}
</tbody>


                  <tfoot>
                      <tr>
                          <td colspan="3" style="text-align: right;"><strong>Total:</strong></td>
                          <td>${amount} RWF</td>
                      </tr>
                  </tfoot>
              </table>
              <h2 class="subtitle">Status: ${status} </h2>

          </div>
      
          <!-- Footer -->
          <div class="footer">
          <p>Best regards,</p>
          <p>Your Online Shop</p>
              <p>If you have any questions, feel free to contact us at <a href="https://destructors-ec-fe.vercel.app/">Destructors Live Chat</a>.</p>
          </div>
      </body>
      
      </html>
    `,
  };
  console.log(products);
  console.log(amount);
  sgMail
    .send(message)
    .then(() => console.log(`Invoice email sent to ${email}`))
    .catch((error) =>
      console.error(`Failed to send invoice email to ${email}`, error)
    );
}
