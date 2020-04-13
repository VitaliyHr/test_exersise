import { hash, compare } from 'bcryptjs';
import { SALT } from '../keys/index';

export const HashPass = async (pass) => {
  let hp;

  try {
    hp = await hash(pass, SALT);
  } catch (err) {
    console.log(err);
    const error = `failed to hash password. Error:${err}`;
    throw new Error(error);
  }

  return hp;
};


export const ChangePass = async (user, newPass) => {
  let hashpass;

  try {
    hashpass = await HashPass(newPass);
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }

  user.password = hashpass;
  user.resetToken = undefined;
  user.dateToken = undefined;

  return user;
};

export const Compare = async (pass, hashed) => {
  let result;

  try {
    result = await compare(pass, hashed);
  } catch (err) {
    console.log(err);
    const error = `Failed to compare password. Error:${err}`;
    throw new Error(error);
  }

  return result;
};
