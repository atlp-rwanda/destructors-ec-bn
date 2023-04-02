import sgMail from '@sendgrid/mail';
import User from '../database/models/index.js';
import { OTP } from '../database/models/index';
import 'dotenv/config';
const validationOTPmail = async (user, otp, token) => {
  const apikey = process.env.API_KEY;
  const url = `http://localhost:3000/api/v1/users/login/validate/${token}`;
  sgMail.setApiKey(apikey);
  const message = {
    to: user.email,
    from: {
      name: 'destructors-team',
      email: process.env.SEND_EMAIL,
    },
    subject: 'click here to confirm',
    text: 'this is the message from sendgrid',
    html: `<a href="${url}">${url} </a>copy this code: ${otp}`,
  };
  sgMail
    .send(message)
    .then((res) => {
      console.log('mesage sent ...');
    })
    .catch((error) => console.log(error));
};
export default validationOTPmail;
