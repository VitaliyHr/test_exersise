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


export async function sendEmail(email, token) {
  sender.sendMail(await reset(email, token), (err) => {
    if (err) {
      console.log(err);
    }
  });
}
