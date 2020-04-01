import { compare, hash } from 'bcryptjs';
import { randomBytes } from 'crypto';
import { FindUserByEmail, CreateUser, FindUserById, CheckToken } from '../servises/user.servise';
import { SALT } from '../keys/index';
import avatar from '../middlewares/avatar';
import { sendEmail } from '../servises/email.servise';
import { session_db } from '../servises/session.servise';

export async function login_controller(req, res, next) {
  const { email } = req.body;
  let candidate, pass;

  try {
    candidate = await FindUserByEmail(email);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: { name: "Critical error", message: "Failed while finding user", errorSthamp:err } });
    return next();
  }

  if (!candidate) {
    res.status(404).json({ success: false, error: { name: "Database error", message: "No user in db" } });
    return next();
  }

  try {
    pass = await compare(req.body.password, candidate.password);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: { name: "Critical error", message: "Failed while comparing password", errorSthamp:err } });
    return next();
  }

  if (!pass) {
    res.status(400).json({ success: false, error: { name: "Access error", message: "Invalid password" } });
    return next();
  }
  return await session_db(req, res, next, candidate);
}


export async function register_controller(req, res, next) {

  const { email, password } = req.body;

  let candidate, hashed_password, user;
  try {
    candidate = await FindUserByEmail(email);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: { name: "Critical error", message: "Fail while finding user", errorSthamp:err } });
    return next();
  }

  if (candidate) {
    res.status(404).json({ success: false, error: { name: "Database error", message: "User have alerady exist" } });
    return next();
  }
  try {
    hashed_password = await hash(password, SALT);
    user = await CreateUser(email, hashed_password, []);
    await user.save();
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: { name: "Critical error", message: "Failed while hashing or creating user", errorSthamp:err } });
    return next();
  }

  if (req.files) {
    return avatar(req, res, next, user);
  }

  res.status(201).json({ success: true, user });
  return next();
}

export function reset_controller(req, res, next) {
  randomBytes(32, async (err, buffer) => {
    if (err) {
      res.status(500).json({ error: { name: "Critical error of server", message: "Error in crypto" } });
      return next();
    }
    const { password } = req.body;
    let user, pass;
    try {
      user = await FindUserById(req.params.id);
    }
    catch (err) {
      console.log(err);
      res.status(500).json({ success: false, error: { name: "Critical error", message: "Failed while finding user", errorSthamp:err } });
      return next();
    }

    if (!user) {
      res.status(404).json({ success: false, error: { name: "Access error", message: "User not found" } })
      return next();
    }
    try {
      pass = await compare(password, user.password);
    }
    catch (err) {
      console.log(err);
      res.status(500).json({ success: false, error: { name: "Critical error", message: "Failed while comparing password", errorSthamp:err } });
      return next();
    }


    if (!pass) {
      res.status(400).json({ success: false, error: { name: "Access error", message: "invalid password" } });
      return next();
    }
    user.resetToken = buffer.toString('hex');
    const token = user.resetToken;
    user.dateToken = Date.now() + 60 * 60 * 1000;

    try{
      await user.save();
      await sendEmail(user.email, token);
    }
    catch(err){
      console.log(err);
      res.status(500).json({success:false, error:{name:"Critical error", message:"Failed while saving user", errorSthamp:err}});
      return next();
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
  let candidate, hashpass;
  try {
    candidate = await CheckToken(token);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "Critical error", message: "Failed while checking token", errorSthamp:err });
    return next();
  }
  if (!candidate) {
    res.status(404).json({ success: false, error: { name: "Database error", message: "no such user" } });
    return next();
  }
  try {
    hashpass = await hash(password, SALT);
    candidate.password = hashpass;
    candidate.resetToken = undefined;
    candidate.dateToken = undefined;
    await candidate.save();
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: { name: "Critical error", message: "Failed while hashing password", errorSthamp:err } });
    return next();
  }

  res.status(201).json({ success: true, user: candidate });
  return next();
}

export async function Logout(req, res, next) {
  req.session.destroy(() => {
    res.status(203).json({ success: true });
    return next();
  });
}
