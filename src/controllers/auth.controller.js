import { compare, hash } from 'bcryptjs';
import { randomBytes } from 'crypto';
import { FindUserByEmail, CreateUser, FindUserById, CheckToken } from '../servises/user.servise';
import { SALT } from '../keys/index';
import avatar from '../middlewares/avatar';
import { sendEmail } from '../servises/email.servise';
import { session_db } from '../servises/session.servise';

export async function login_controller(req, res, next) {
  const { email } = req.body;
  const candidate = await FindUserByEmail(email);

  if (!candidate) {
    res.status(404).json({ success:false, error:{ name:"Database error", message:"No user in db"}});
    return next();
  }
  const pass = await compare(req.body.password, candidate.password);
  if (!pass) {
    res.status(400).json({ success: false, error: { name:"Access error", message: "Invalid password" }});
    return next();
  }
  session_db(req, res, next, candidate);
  res.status(200).json({ success:true, user:req.session.user });
  return next();
}


export async function register_controller(req, res, next) {

  const { email, password, confirm } = req.body;

  if (password !== confirm) {
    res.status(400).json({ success:false, error:{ name:"Validation error",message:"password and confirm is not equal"}});
    return next();
  }
  const candidate = await FindUserByEmail(email);
  if (candidate) {
    res.status(404).json({ success:false, error:{ name:"Database error", message:"User have alerady exist"}});
    return next();
  }
  const hashed_password = await hash(password, SALT);
  const user = await CreateUser(email, hashed_password, []);

  if (req.files) {
    return avatar(req, res, next, user);
  }
  await user.save();
  res.status(201).json({ success:true,user});
  return next();
}

export function reset_controller(req, res, next) {
  randomBytes(32, async (err, buffer) => {
    if (err) {
      res.status(500).json({error:{name:"Critical error of server", message:"Error in crypto"}});
      return next();
    }
    const { password } = req.body;
    const user = await FindUserById(req.params.id);
    if(!user){
      res.status(404).json({success:false, error:{name:"Access error", message:"User not found"}})
      return next();
    }
    const pass = await compare(password, user.password);

    if (!pass) {
      res.status(400).json({ success:false, error:{ name:"Access error", message:"invalid password"}});
      return next();
    }
    user.resetToken = buffer.toString('hex');
    const token = user.resetToken;
    user.dateToken = Date.now() + 60 * 60 * 1000;
    await user.save();

    res.status(200).json({ success:true, user });
    await sendEmail(user.email, token);
    return next();
  });
}

export function getReset(req, res, next) {
  res.status(200).json({success:true,data:{ token: req.params.token }});
  return next();
}

export async function SetPass(req, res, next) {

  const { token, password } = req.body;
  const candidate = await CheckToken(token);

  if (!candidate) {
    res.status(404).json({success:false,error:{name:"Database error",message:"no such user"}});
    return next();
  }
  const hashpass = await hash(password, SALT);
  candidate.password = hashpass;
  candidate.resetToken = undefined;
  candidate.dateToken = undefined;
  await candidate.save();

  res.status(201).json({success:true,user:candidate});
  return next();
}

export async function Logout(req, res, next) {
  req.session.destroy(() => {
    res.status(204).json({success:true});
    return next();
  });
}
