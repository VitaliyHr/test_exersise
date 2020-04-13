import { randomBytes } from 'crypto';
import {
  FindUserByEmail, CreateUser, FindUserById, CheckToken, SetToken, SaveUserChanges,
} from '../servises/user.servise';
import avatar from '../middlewares/avatar';
import sendEmail from '../servises/email.servise';
import { DestroySession } from '../servises/session.servise';
import sessionDb from '../middlewares/session';
import { ChangePass, Compare, HashPass } from '../servises/bcrypt.servise';

export async function loginController(req, res, next) {
  const { email } = req.body;
  let candidate;
  let pass;

  try {
    candidate = await FindUserByEmail(email);
  } catch (err) {
    console.log(err);
    const error = `Failed to find user by email${email}. Source:${err}`;
    res.status(500).send(error);
    return next();
  }

  if (!candidate) {
    res.status(404).send('No user in db');
    return next();
  }

  try {
    pass = await Compare(req.body.password, candidate.password);
  } catch (err) {
    console.log(err);
    const error = `Failed to compare password by bcrypt. Source:${err}`;
    res.status(500).send(error);
    return next();
  }

  if (!pass) {
    res.status(400).send('Invalid password');
    return next();
  }
  try {
    await sessionDb(req, res, next, candidate);
  } catch (err) {
    console.log(err);
    const error = `Failed to write session with userId${candidate.id}.Source:${err}`;
    res.status(500).send(error);
    return next();
  }

  res.status(200).json({ success: true, user: req.session.user });
  return next();
}


export async function registerController(req, res, next) {
  const { email, password } = req.body;
  let candidate;
  let hashedPassword;
  let user;

  try {
    candidate = await FindUserByEmail(email);
  } catch (err) {
    console.log(err);
    const error = `Failed to find user by email ${email}. Source:${err}`;
    res.status(500).send(error);
    return next();
  }

  if (candidate) {
    res.status(404).send('User have alerady exist');
    return next();
  }

  try {
    hashedPassword = await HashPass(password);
  } catch (err) {
    console.log(err);
    const error = `Failed to hash password. Source:${err}`;
    res.status(500).send(error);
    return next();
  }

  try {
    user = await CreateUser(email, hashedPassword, []);
  } catch (err) {
    console.log(err);
    const error = `Failed to create user.Source:${err}`;
    res.status(500).send(error);
    return next();
  }
  try {
    await SaveUserChanges(user);
  } catch (err) {
    console.log(err);
    const error = `Failed to save user.Source:${err}`;
    res.status(500).send(error);
    return next();
  }

  if (req.files) {
    return avatar(req, res, next, user);
  }

  res.status(201).json({ success: true, user });
  return next();
}


export function resetController(req, res, next) {

  randomBytes(32, async (err, buffer) => {
    if (err) {
      const error = `Error in crypto. Error:${err}`;
      res.status(500).send(error);
      return next();
    }
    const { password } = req.body;
    let user;
    let pass;
    let newUser;

    try {
      user = await FindUserById(req.params.id);
    } catch (error) {
      console.log(error);
      const e = `Failed to find user by userId${req.params.id}.Source:${error}`;
      res.status(500).send(e);
      return next();
    }

    if (!user) {
      res.status(404).send('User not found');
      return next();
    }

    try {
      pass = await Compare(password, user.password);
    } catch (error) {
      console.log(error);
      const e = `Failed to compare password. Source:${error}`;
      res.status(500).send(e);
      return next();
    }


    if (!pass) {
      res.status(400).send('invalid password');
      return next();
    }

    const token = buffer.toString('hex');

    try {
      newUser = await SetToken(user, token);
    } catch (error) {
      console.log(error);
      const e = `Failed to set token.Source:${error}`;
      res.status(500).send(e);
      return next();
    }

    try {
      await SaveUserChanges(newUser);
    } catch (error) {
      console.log(error);
      const e = `Failed to save user. Source:${error}`;
      res.status(500).send(e);
      return next();
    }

    res.status(200).json({ success: true, user });

    try {
      sendEmail(user.email, token);
    } catch (error) {
      console.log(error);
      const e = `Failed to send email. Source:${error}`;
      res.status(500).send(e);
      return next();
    }
    return next();
  });
}


export function getReset(req, res, next) {
  res.status(200).json({ success: true, data: { token: req.params.token } });
  return next();
}


export async function SetPass(req, res, next) {
  const { token, password } = req.body;
  let candidate;
  let user;

  try {
    candidate = await CheckToken(token);
  } catch (err) {
    console.log(err);
    const error = `Failed to check token${token}. Source:${err}`;
    res.status(500).send(error);
    return next();
  }

  if (!candidate) {
    res.status(404).send('user not found');
    return next();
  }

  try {
    user = await ChangePass(candidate, password);
  } catch (err) {
    console.log(err);
    const error = `Failed to change password of user${candidate.id}. Source:${err}`;
    res.status(500).send(error);
    return next();
  }

  try {
    await SaveUserChanges(user);
  } catch (err) {
    console.log(err);
    const error = `Failed to save user${user.id}. Source:${err}`;
    res.status(500).send(error);
    return next();
  }

  res.status(201).json({ success: true, user: candidate });
  return next();
}

export async function Logout(req, res, next) {
  try {
    DestroySession(req, res, next);
  } catch (err) {
    console.log(err);
    const error = `Failed to destroy session. Source:${err}`;
    res.status(500).send(error);
    return next();
  }
}
