import { createTransport } from 'nodemailer';
import reset from '../emails/reset';
import { LOGIN, PASS } from '../keys/index';

const sender = createTransport({
  servise: 'gmail',
  auth: {
    user: LOGIN,
    pass: PASS,
  },
});


export default function sendEmail(email, token) {
  try {
    sender.sendMail(reset(email, token), (err) => {
      if (err) {
        console.log(err);
      }
    });
  } catch (err) {
    console.log(err);
    const error = `Failed to send email. Error:${err}`;
    throw new Error(error);
  }
}
