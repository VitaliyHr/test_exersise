import User from '../models/user';


export async function FindUserById(id) {
  if (id) {
    let user;

    try {
      user = await User.findById(id);
    } catch (err) {
      console.log(err);
      const error = `Failed to find user. Error:${err}`;
      throw new Error(error);
    }

    return user;
  }
}

export async function FindUserByEmail(email) {
  if (email) {
    let user;
    try {
      user = await User.findOne({ email });
    } catch (err) {
      console.log(err);
      const error = `Failed to findOne by email. Error:${err}`;
      throw new Error(error);
    }

    return user;
  }
}

export async function SaveUserChanges(user) {
  if (!user) {
    throw new Error('Function was called without params');
  }
  try {
    await user.save();
  } catch (err) {
    console.log(err);
    const error = `Failed to save changes. Error${err}`;
    throw new Error(error);
  }
}

export async function CreateUser(email, password, books) {
  const user = new User({
    email, password, books,
  });

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
    console.log(err);
    const error = `Failed to find user by token. Error:${err}`;
    throw new Error(error);
  }
  if (user) {
    return user;
  }
}

export async function SetToken(user, resetToken) {
  user.resetToken = resetToken;
  user.dateToken = Date.now() + 60 * 60 * 1000;

  return user;
}
