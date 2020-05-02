import { createTransport } from 'nodemailer';
import sendgrid from 'nodemailer-sendgrid-transport';
import reset from '../emails/reset';
import { SendGridAPIKEY } from '../keys/index';


const sender = createTransport(sendgrid({
  auth: {
    api_key: SendGridAPIKEY,
  },
}));


export default async function sendEmail(email, token) {
  try {
    await sender.sendMail(reset(email, token));
  } catch (err) {
    const error = `Failed to send message to user ${email} ${err}`;
    throw new Error(error);
  }
}
