import { LOGIN, SITE_URI } from '../keys/index';

export default function (email, token) {
  return {
    to: email,
    from: LOGIN,
    subject: 'Password reset',
    html: `
        <p><a href="${SITE_URI}/auth/reset/${token}">Скинути пароль</a></p>
        <hr>`,
  };
}