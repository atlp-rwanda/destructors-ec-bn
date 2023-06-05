import sgMail from '@sendgrid/mail';
import User from '../database/models/index.js';
import { OTP } from '../database/models/index';
import 'dotenv/config';

const validationOTPmail = async (user, otp, token) => {
  const apikey = process.env.API_KEY;
  const url = `${process.env.VERIFYEMAIL}?token=${token}`;
  sgMail.setApiKey(apikey);
  const message = {
    to: user.email,
    from: {
      name: 'destructors-team',
      email: process.env.SEND_EMAIL,
    },
    subject: 'Click here to confirm',
    text: 'This is the message from SendGrid',
    html: `
      <html>
        <head>
          <style>
            .container {
              border: 2px;
            }
            .button {
              background-color: #2D719D;
              padding: 10px 20px;
              text-decoration: none;
              font-weight: bold;
              border-radius: 4px;
            }
            img{
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            .header{
              background-repeat: no-repeat;
              background-size: fit;
              width: 100%;
              height: 120px;
            }
            a{
              text-decoration: none;
              color: white;
            }
            span{
              color: #fff;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class = "header">
              <img src='https://d1u4v6449fgzem.cloudfront.net/2020/03/The-Ecommerce-Business-Model-Explained.jpg' alt='header'/>
            </div>
            <h2>Click to verify your email</h2>
            <p>Copy this code: ${otp}</p>
            <a href="${url}" class="button"><span>Verify Email</span></a>
          </div>
        </body>
      </html>
    `,
  };

  sgMail
    .send(message)
    .then((res) => {
      console.log('Message sent...');
    })
    .catch((error) => console.log(error));
};

export default validationOTPmail;