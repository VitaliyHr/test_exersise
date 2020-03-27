const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const user_servise = require('../servises/user.servise');
const keys = require('../keys/index');
const avatar = require('../middlewares/avatar');
const emailSender = require('../servises/email.servise');
const {session_db} = require('../servises/session.servise')

exports.login_controller = async (req, res, next) => {
  const { email } = req.body;
  const candidate = await user_servise.FindUserByEmail(email);

  if (!candidate) {
    res.status(404).json({ success:false, error:{ name:"Database error", message:"No user in db"}});
    return next();
  }
  const pass = await bcrypt.compare(req.body.password, candidate.password);
  if (!pass) {
    res.status(400).json({ success: false, error: { name:"Access error", message: "Invalid password" }});
    return next();
  }
  session_db(req, res, next, candidate);
  res.status(200).json({ success:true, user:req.session.user });
  return next();
};


exports.register_controller = async (req, res, next) => {

  const { email, password, confirm } = req.body;

  if (password !== confirm) {
    res.status(400).json({ success:false, error:{ name:"Validation error",message:"password and confirm is not equal"}});
    return next();
  }
  const candidate = await user_servise.FindUserByEmail(email);
  if (candidate) {
    res.status(404).json({ success:false, error:{ name:"Database error", message:"User have alerady exist"}});
    return next();
  }
  const hashed_password = await bcrypt.hash(password, keys.SALT);
  const user = await user_servise.CreateUser(email, hashed_password, []);

  if (req.files) {
    return avatar(req, res, next, user);
  }
  await user.save();
  res.status(201).json({ success:true,user});
  return next();
};

exports.reset_controller = (req, res, next) => {
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      res.status(500).json({error:{name:"Critical error of server", message:"Error in crypto"}});
      return next();
    }
    const { password } = req.body;
    const user = await user_servise.FindUserById(req.params.id);
    if(!user){
      res.status(404).json({success:false, error:{name:"Access error", message:"User not found"}})
      return next();
    }
    const pass = await bcrypt.compare(password, user.password);

    if (!pass) {
      res.status(400).json({ success:false, error:{ name:"Access error", message:"invalid password"}});
      return next();
    }
    user.resetToken = buffer.toString('hex');
    const token = user.resetToken;
    user.dateToken = Date.now() + 60 * 60 * 1000;
    await user.save();

    res.status(200).json({ success:true, user });
    await emailSender.sendEmail(user.email, token);
    return next();
  });
};

exports.getReset = (req, res, next) => {
  res.status(200).json({success:true,data:{ token: req.params.token }});
  return next();
};

exports.SetPass = async (req, res, next) => {

  const { token, password } = req.body;
  const candidate = await user_servise.CheckToken(token);

  if (!candidate) {
    res.status(404).json({success:false,error:{name:"Database error",message:"no such user"}});
    return next();
  }
  const hashpass = await bcrypt.hash(password, keys.SALT);
  candidate.password = hashpass;
  candidate.resetToken = undefined;
  candidate.dateToken = undefined;
  await candidate.save();

  res.status(201).json({success:true,user:candidate});
  return next();
};

exports.Logout = async (req, res, next) => {
  req.session.destroy(() => {
    res.status(204).json({success:true});
    return next();
  });
};
