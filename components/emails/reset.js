const { LOGIN, SITE_MOUNT, SITE_URI } = require('../../config/config.js');

module.exports = (email, token) => ({
  to: email,
  from: LOGIN,
  subject: 'Password reset',
  html: `
        <p><a href="${SITE_URI}${SITE_MOUNT}/auth/change/${token}">Скинути пароль</a></p>
        <hr>`,
});
