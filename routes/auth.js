const { Router } = require('express');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/user');
const keys = require('../keys/index');
const { loginvalidator, registervalidator } = require('../middlewares/validator.js');
const auth = require('../middlewares/auth');
const reset = require('../emails/reset');
const avatar = require('../middlewares/avatar');


const sender = nodemailer.createTransport({
  servise: 'gmail',
  auth: {
    user: keys.LOGIN,
    pass: keys.PASS,
  },
});

const router = Router();


router.post('/login', loginvalidator, async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(errors.array()[0].msg);
    }


    const { email, password } = req.body;
    const candidate = await User.findOne({ email });

    if (!candidate) {
      return res.status(400).json('auth error');
    }
    const pass = await bcrypt.compare(password, candidate.password);

    if (pass) {
      req.session.user = candidate;
      req.session.isAuthenticated = true;
      await req.session.save((err) => {
        if (err) {
          throw err;
        }
      })
      return res.status(200).json(req.session.user);
    }
    res.status(400).json('invalid password')
  }
  catch (e) {
    console.log(e);
  }
});

router.post('/register', registervalidator, async (req, res) => {

  try {
    const { email, password, confirm } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(errors.array()[0].msg);
    }

    if (password !== confirm) {
      return res.status(400).json('password and confirm is not equal');
    }

    const candidate = await User.findOne({ email });

    if (candidate) {
      return res.status(400).json('User have alerady exist');
    }

    const hashed_password = await bcrypt.hash(password, keys.SALT);
    const user = new User({
      email,
      password: hashed_password,
      books: [],
    });

    if (req.files) {
      return await avatar(req, res, user);
    }
    await user.save();
    res.status(200).json(user);

  }
  catch (e) {
    console.log(e);
  }
});

//скинути пароль
router.post('/reset:id', auth, (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      
      if (err) {
        res.status(400).json('Error');
      } 
      else {
        const { password } = req.body;
        const user = await User.findOne({ _id: req.params.id });
        const aute = await bcrypt.compare(password, user.password);
        if (!aute) {
          res.status(400).json('Wrong password');
        }
        else {
          user.resetToken = buffer.toString('hex');
          const token = user.resetToken;
          user.dateToken = Date.now() + 60 * 60 * 1000;
          await user.save();

          res.status(200).json(user);

          sender.sendMail(await reset(user.email, token), (err) => {
            if (err) {
              console.log(err);
            }
          });
        }
      }
    });
  } catch (e) {
    console.log(e);
  }
});

//url для відновлення
router.get('/reset:token', auth, (req, res)=> {
  return res.status(200).json({ token: req.params.token, password: '111111' });
});

//ввод нового паролю
router.put('/password', auth, async (req, res) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({
      resetToken: token,
      dateToken: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json('Invalid user');
    }

    const hashpass = await bcrypt.hash(password, keys.SALT);
    user.password = hashpass;
    user.resetToken = undefined;
    user.dateToken = undefined;
    await user.save();

    res.status(200).json(user);
  } 
  catch (e) {
    console.log(e);
  }

});

//вийти з аккаунта
router.get('/logout', auth, async (req, res) => {
  req.session.destroy(() => {
    res.status(300).json(req.session);
  });
});


module.exports = router;