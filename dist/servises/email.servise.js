'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendEmail = sendEmail;

var _nodemailer = require('nodemailer');

var _reset = require('../emails/reset');

var _reset2 = _interopRequireDefault(_reset);

var _index = require('../keys/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sender = (0, _nodemailer.createTransport)({
  servise: 'gmail',
  auth: {
    user: _index.LOGIN,
    pass: _index.PASS
  }
});

async function sendEmail(email, token) {
  sender.sendMail((await (0, _reset2.default)(email, token)), function (err) {
    if (err) {
      console.log(err);
    }
  });
}