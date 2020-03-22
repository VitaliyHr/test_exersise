const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const user_servise = require('../servises/user.servise');
const keys = require('../keys/index');
const avatar = require('../middlewares/avatar');
const emailSender = require('../servises/email.servise');

exports.login_controller = async (req, res, next) => {
  const candidate = await user_servise.FindUserByEmail(req.body.email);

  if (!candidate) {
    res.status(400).json('auth error');
    return next();
  }
  const pass = await bcrypt.compare(req.body.password, candidate.password);
  if (!pass) {
    res.status(400).json({ error: true, message: 'Invalid password' });
    return next();
  }
  req.session.user = candidate;
  req.session.isAuthenticated = true;
  await req.session.save((err) => {
    if (err) {
      throw err;
    }
  });
  res.status(200).json(req.session.user);
  return next();
};


exports.register_controller = async (req, res, next) => {

  const { email, password, confirm } = req.body;

  if (password !== confirm) {
    res.status(400).json('password and confirm is not equal');
    return next();
  }
  const candidate = await user_servise.FindUserByEmail(email);
  if (candidate) {
    res.status(400).json('User have alerady exist');
    return next();
  }
  const hashed_password = await bcrypt.hash(password, keys.SALT);
  const user = await user_servise.CreateUser(email, hashed_password, []);

  if (req.files) {
    return avatar(req, res, user);
  }
  await user.save();
  res.status(201).json(user);
  return next();
};

exports.reset_controller = (req, res, next) => {
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      throw err;
    }
    const { password } = req.body;
    const user = await user_servise.FindUserById(req.params.id);
    const pass = await bcrypt.compare(password, user.password);

    if (!pass) {
      res.status(400).json('invalid password');
      return next();
    }
    user.resetToken = buffer.toString('hex');
    const token = user.resetToken;
    user.dateToken = Date.now() + 60 * 60 * 1000;
    await user.save();

    res.status(200).json(user);
    await emailSender.sendEmail(user.email, token);
    return next();
  });
};

exports.getReset = (req, res, next) => {
  res.status(200).json({ token: req.params.token, password: '111111' });
  return next();
};

exports.SetPass = async (req, res, next) => {

  const { token, password } = req.body;
  const candidate = await user_servise.CheckToken(token);

  if (!candidate) {
    res.status(400).json('no such user');
    return next();
  }
  const hashpass = await bcrypt.hash(password, keys.SALT);
  candidate.password = hashpass;
  candidate.resetToken = undefined;
  candidate.dateToken = undefined;
  await candidate.save();

  res.status(200).json(candidate);
  return next();
};

exports.Logout = async (req, res, next) => {
  req.session.destroy(() => {
    res.status(300).json(req.session);
    return next();
  });
};
