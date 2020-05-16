import { randomBytes } from 'crypto';
import log4js from '../middlewares/loggerConfig';
import {
  FindUserByEmail, CreateUser, FindUserById, CheckToken, SetToken, SaveUserChanges,
} from '../servises/user';
import avatar from '../middlewares/avatar';
import sendEmail from '../servises/email';
import { DestroySession } from '../servises/session';
import sessionDb from '../middlewares/session';
import { ChangePass, Compare, HashPass } from '../servises/bcrypt';

const infoLogger = log4js.getLogger();


export async function login(req, res, next) {
  const { email, password } = req.body;
  let candidate;
  let pass;

  try {
    candidate = await FindUserByEmail(email);
  } catch (err) {
    const error = `Failed to find user by email ${email}`;
    res.status(500).json({ success: false, error });
    return next(new Error(error));
  }

  if (!candidate) {
    const error = `User ${email} not found.`;
    res.status(404).json({ success: false, error });
    return next();
  }

  try {
    pass = await Compare(password, candidate.password);
  } catch (err) {
    const error = `Failed to compare candidate ${candidate.id} password by bcrypt`;
    res.status(500).json({ success: false, error });
    return next(new Error(error));
  }

  if (!pass) {
    const error = `Invalid userid ${candidate.id} password `;
    res.status(400).json({ success: false, error });
    return next(new SyntaxError(error));
  }
  try {
    sessionDb(req, candidate);
  } catch (err) {
    const error = `Failed to save session with userId${candidate.id}`;
    res.status(500).json({ success: false, error });
    return next(new Error(error));
  }

  infoLogger.info(`User ${candidate.id} logined`);
  res.status(200).json({ success: true, user: candidate });
  return next();
}


export async function register(req, res, next) {
  const { email, password } = req.body;
  let candidate;
  let hashedPassword;
  let user;

  try {
    candidate = await FindUserByEmail(email);
  } catch (err) {
    const error = `Failed to find user by email ${email}  ${err}`;
    res.status(500).json({ success: false, error });
    return next(new Error(error));
  }

  if (candidate) {
    const error = `User with email ${email} have alerady existst`;
    res.status(400).json({ success: false, error });
    return next(new Error(error));
  }

  try {
    hashedPassword = await HashPass(password);
  } catch (err) {
    const error = `Failed to hash userId ${candidate.id} password`;
    res.status(500).json({ success: false, error });
    return next(new Error(error));
  }

  try {
    user = await CreateUser(email, hashedPassword);
  } catch (err) {
    const error = `Failed to create user ${err}`;
    res.status(500).json({ success: false, error });
    return next(new Error(error));
  }

  infoLogger.info(`Created new user ${user.id}`);

  if (req.files) {
    return avatar(req, res, next, user);
  }

  res.status(201).json({ success: true, user });
  return next();
}


export function reset(req, res, next) {
  randomBytes(32, async (err, buffer) => {
    if (err) {
      const error = `Error in crypto ${err}`;
      res.status(500).json({ success: false, error });
      return next(new Error(error));
    }
    const { password } = req.body;
    const { id } = req.params;
    let user;
    let pass;

    try {
      user = await FindUserById(id);
    } catch (error) {
      const e = `Failed to find user by userId${req.params.id}`;
      res.status(500).json({ success: false, error: e });
      return next(new Error(e));
    }

    if (!user) {
      const error = `UserId ${id} not found`;
      res.status(404).json({ success: false, error });
      return next();
    }

    try {
      pass = await Compare(password, user.password);
    } catch (error) {
      const e = `Failed to compare userId ${id} password`;
      res.status(500).json({ success: false, error: e });
      return next(new Error(e));
    }


    if (!pass) {
      const error = `Invalid user ${id} password`;
      res.status(400).json({ success: false, error });
      return next(new Error(error));
    }

    const token = buffer.toString('hex');
    const newUser = SetToken(user, token);

    try {
      await SaveUserChanges(newUser);
    } catch (error) {
      const e = `Failed to save user ${id}`;
      res.status(500).json({ success: false, error: e });
      return next(new Error(e));
    }

    infoLogger.info(`User ${user.id} want to change password`);
    try {
      await sendEmail(user.email, token);
    } catch (error) {
      const e = `Failed to send email to user ${id} ${error}`;
      res.status(500).json({ success: false, error: e });
      return next(new Error(e));
    }

    res.status(200).json({ success: true, user });
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
    const error = `Failed to check token ${token}`;
    res.status(500).json({ success: false, error });
    return next(new Error(error));
  }

  if (!candidate) {
    const error = `User with token ${token} not found`;
    res.status(404).json({ success: false, error });
    return next(new Error(error));
  }

  try {
    user = await ChangePass(candidate, password);
  } catch (err) {
    const error = `Failed to change password of user${candidate.id}`;
    res.status(500).json({ success: false, error });
    return next(new Error(error));
  }

  try {
    await SaveUserChanges(user);
  } catch (err) {
    const error = `Failed to save user${user.id}`;
    res.status(500).json({ success: false, error });
    return next(new Error(error));
  }
  infoLogger.info(`User ${user.id} changed password`);
  res.status(200).json({ success: true, user: candidate });
  return next();
}

export async function Logout(req, res, next) {
  try {
    infoLogger.info(`User ${req.session.user._id} logouted`);
    DestroySession(req, res, next);
  } catch (err) {
    const error = `Failed to destroy session ${err}`;
    res.status(500).json({ success: false, error });
    return next(new Error(error));
  }
}
