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

const sendVerificationEmail = async (email, token) => {
  const link = `${process.env.APP_URL}/verify-email?t=${token}`;
  const msg = {
    to: email,
    from: {
      name: 'DESTRUCTORS',
      email: process.env.SEND_EMAILS
    },
    subject: 'Please verify your email adress',
    html: `Please click on the following link to verify your email address: <a href="${link}">${link}</a>`
  };

  try {
    const result = await sgMail.send(msg);
    console.log("email sent");
    return result;
  } catch (error) {
    console.log(error);
  }
}


export { sendEmail, sendVerificationEmail };
