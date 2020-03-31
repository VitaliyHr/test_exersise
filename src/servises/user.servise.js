import User from '../models/user';


export async function FindUserById(id) {
  if (id) {
    return await User.findById(id)
  }
}

export async function FindUserByEmail(email) {
  if (email) {
    return await User.findOne({ email })
  }
}

export async function CreateUser(email, password, books) {
  const user = new User({
    email, password, books,
  });
  await user.save();
  return user;
}

export async function CheckToken(token) {
  const user = await User.findOne({
    resetToken: token,
    dateToken: { $gt: Date.now() },
  });
  if (user) {
    return user;
  }
}
