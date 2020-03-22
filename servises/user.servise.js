const User = require('../models/user');


exports.FindUserById = async (id) => {
  if (id) {
    return await User.findById(id)
  }
};

exports.FindUserByEmail = async (email) => {
  if (email) {
    return await User.findOne({ email })
  }
};

exports.CreateUser = async (email, password, books) => {
  const user = new User({
    email, password, books,
  });
  await user.save();
  return user;
};

exports.CheckToken = async (token) => {
  const user = await User.findOne({
    resetToken: token,
    dateToken: { $gt: Date.now() },
  });
  if (user) {
    return user;
  }
};
