import { createTransport } from 'nodemailer';
import { LOGIN, PASS } from '../../config/config';
import reset from '../../components/emails/reset';


const sender = createTransport({
  host: 'smtp.gmail.com',
  auth: {
    user: LOGIN,
    pass: PASS,
  },
});


export default async function sendEmail(email, token) {
  try {
    await sender.sendMail(reset(email, token));
  } catch (err) {
    const error = `Failed to send message to user ${email} ${err}`;
    throw error;
  }
}
