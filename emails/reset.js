const keys = require('../keys/index');

module.exports = function (email, token) {
  return {
    to: email,
    from: keys.LOGIN,
    subject: 'Password reset',
    html: `
        <p><a href="${keys.SITE_URI}/auth/reset/${token}">Скинути пароль</a></p>
        <hr>`,
  };
}