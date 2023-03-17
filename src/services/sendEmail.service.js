import sgMail from "@sendgrid/mail";
import "dotenv/config";

const apiKey = process.env.API_KEY;
sgMail.setApiKey(apiKey);

const sendEmail = (sendToEmail, subject, HTMLText) => {

    const message = {
        to: sendToEmail,
        from: {
          name: "DESTRUCTORS",
          email: process.env.SEND_EMAIL
        },
        subject: subject,

        html: HTMLText

      };
      sgMail
        .send(message)
        .then((res) => console.log('email sent...'))
        .catch((error) => {
          console.log(error.message)
        });
};

export default sendEmail;