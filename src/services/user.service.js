/* eslint-disable no-unused-vars */
import { BcryptUtil } from '../utils/bcrypt';

const { User } = require('../database/models');

const register = async (data) => {
  const { firstname, lastname, email, password, role, isActive } = data;
  const user = await User.create({
    firstname,
    lastname,
    email,
    password: await BcryptUtil.hash(password),
    role,
    isActive,
  });
};

const findUser = async (email) => {
  const UserInfo = await User.findOne({ where: { email: email } });

  if (UserInfo == null) {
    return false;
  } else {
    return UserInfo;
  }
};
const findUserById = async (id) => {
  const UserInfo = await User.findOne({ where: { id } });

  if (UserInfo == null) {
    return false;
  } else {
    return UserInfo;
  }
};

export { register, findUser, findUserById };
