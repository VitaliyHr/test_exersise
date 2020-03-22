const nodemailer = require('nodemailer');
const reset = require('../emails/reset');
const keys = require('../keys/index');

const sender = nodemailer.createTransport({
  servise: 'gmail',
  auth: {
    user: keys.LOGIN,
    pass: keys.PASS,
  },
});


exports.sendEmail = async (email, token) => {
  sender.sendMail(await reset(email, token), (err) => {
    if (err) {
      console.log(err);
    }
  });
};
