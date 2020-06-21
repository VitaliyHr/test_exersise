import { SaveSession } from '../servises/session';

export default async function sessionDb(req, user) {
  req.session.user = user;
  req.session.isAuthenticated = true;
  await SaveSession(req);
}
