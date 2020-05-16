import { createTransport } from 'nodemailer';
import config from 'config';
import reset from '../../components/emails/reset';


const sender = createTransport({
  host: 'smtp.gmail.com',
  auth: {
    user: config.get('LOGIN'),
    pass: config.get('PASS'),
  },
});


export default async function sendEmail(email, token) {
  try {
    await sender.sendMail(reset(email, token));
  } catch (err) {
    const error = `Failed to send message to user ${email} ${err}`;
    throw new Error(error);
  }
}
