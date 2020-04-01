import { FindUserById } from '../servises/user.servise';
import avatar from '../middlewares/avatar';

export async function Profile(req, res, next) {
  let user;
  try{
    user = await FindUserById(req.session.user._id);
  }
  catch(err){
    console.log(err);
    res.status(500).json({success:false, error:{name:"Critical error", message:"Failed while finding user", errorSthamp:err}});
    return next();
  }
  if (req.files) {
    return avatar(req, res, next, user);
  }
  await user.save();
  res.status(400).json({ success:false, error:{name:"Request error", message:"File not found"}});
  return next();
}
