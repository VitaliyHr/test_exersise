const config = require('config');

module.exports = function (email, token) {
  return {
    to: email,
    from: config.get('LOGIN'),
    subject: 'Password reset',
    html: `
        <p><a href="${config.get('SITE_URI')}/auth/reset/${token}">Скинути пароль</a></p>
        <hr>`,
  };
};
