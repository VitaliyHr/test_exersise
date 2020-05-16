const config = require('config');

module.exports = (email, token) => ({
  to: email,
  from: config.get('LOGIN'),
  subject: 'Password reset',
  html: `
        <p><a href="${config.get('SITE_URI')}${config.get('SITE_MOUNT')}/auth/change/${token}">Скинути пароль</a></p>
        <hr>`,
});
