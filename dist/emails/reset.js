'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (email, token) {
  return {
    to: email,
    from: _index.LOGIN,
    subject: 'Password reset',
    html: '\n        <p><a href="' + _index.SITE_URI + '/auth/reset/' + token + '">\u0421\u043A\u0438\u043D\u0443\u0442\u0438 \u043F\u0430\u0440\u043E\u043B\u044C</a></p>\n        <hr>'
  };
};

var _index = require('../keys/index');