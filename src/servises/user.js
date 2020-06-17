import User from '../models/user';


export async function FindUserById(id) {
  let user;

  try {
    user = await User.findById(id);
  } catch (err) {
    const error = 'Failed to find user';
    throw error;
  }

  return user;
}

export async function FindUserByEmail(email) {
  let user;
  try {
    user = await User.findOne({ email });
  } catch (err) {
    const error = 'Failed to find one by email';
    throw error;
  }

  return user;
}

export async function SaveUserChanges(user) {
  try {
    await user.save();
  } catch (err) {
    const error = 'Failed to save changes';
    throw error;
  }
}

export async function CreateUser(email, password) {
  const user = new User({
    email, password,
  });
  try {
    await user.save();
  } catch (err) {
    const error = 'Failed to save new user in database';
    throw error;
  }
  return user;
}

export async function CheckToken(token) {
  let user;

  try {
    user = await User.findOne({
      resetToken: token,
      dateToken: { $gte: Date.now() },
    });
  } catch (err) {
    const error = 'Failed to find user by token';
    throw error;
  }

  return user;
}

export function SetToken(user, resetToken) {
  user.resetToken = resetToken;
  user.dateToken = Date.now() + 60 * 60 * 1000;

  return user;
}
