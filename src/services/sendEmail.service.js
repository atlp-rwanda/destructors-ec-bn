import sgMail from '@sendgrid/mail';
import 'dotenv/config';

const apiKey = process.env.API_KEY;
sgMail.setApiKey(apiKey);

const sendEmail = (sendToEmail, subject, HTMLText) => {
  const message = {
    to: sendToEmail,
    from: {
      name: 'DESTRUCTORS',
      email: process.env.SEND_EMAIL
    },
    subject,

    html: HTMLText

  };
  sgMail
    .send(message)
    .then((res) => console.log('email sent...'))
    .catch((error) => {
      console.log(error.message);
    });
};

const sendVerificationEmail = async (email, name, token) => {
  const link = `${process.env.VERIFY_EMAIL}/verify-email?t=${token}`;
  const msg = {
    to: email,
    from: {
      name: 'DESTRUCTORS',
      email: process.env.SEND_EMAILS
    },
    subject: 'Please verify your email adress',
    html: `<html>
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
   <div style='font-size: 12px'><strong> <h3>Hi ${name}<h3/><br> <br>
    <div class = "header">
    <img src='https://d1u4v6449fgzem.cloudfront.net/2020/03/The-Ecommerce-Business-Model-Explained.jpg' alt='header'/>
    </div><br> <br>
    <div class="container">
    <h3>Please click  here to verify your email.</h3>
    <a href="${link}" class="button"><span>Verify Email</span></a>
    </div>
    <br> <br>Remember, beware of scams and keep this one-time verification link confidential.<br>
    </strong><br> DESTRUCTORS </div>
    </body>
    </html>
  `
  };

  try {
    const result = await sgMail.send(msg);
    console.log('email sent');
    return result;
  } catch (error) {
    console.log(error);
  }
};

export { sendEmail, sendVerificationEmail };
