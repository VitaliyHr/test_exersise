import { SaveSession } from '../servises/session.servise';

export default async function sessionDb(req, res, next, user) {
  req.session.user = user;
  req.session.isAuthenticated = true;
  try {
    await SaveSession(req);
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}
