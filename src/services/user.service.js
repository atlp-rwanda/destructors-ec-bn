/* eslint-disable no-unused-vars */
import { BcryptUtil } from '../utils/bcrypt';
import { Blacklist } from '../database/models';

const { User } = require('../database/models');

const register = async (data) => {
  const {
    firstname, lastname, email, password, role, isActive
  } = data;
  const user = await User.create({
    firstname,
    lastname,
    email,
    password: await BcryptUtil.hash(password),
    role,
    isActive,
  });
};

const findUserByEmail = async (email) => {
  const UserInfo = await User.findOne({ where: { email } });

  if (UserInfo == null) {
    return false;
  }
  return UserInfo;
};

const logout = async (userData) => {
  const token = userData.split(' ')[1];
  await Blacklist.create({ token });
};

const findUserById = async (id) => {
  const UserInfo = await User.findOne({ where: { id } });

  if (UserInfo == null) {
    return false;
  }
  return UserInfo;
};
const findAllUsers = async () => {
  const users = await User.findAll({
    order: [
      ['createdAt', 'DESC']
    ]
  });
  return users;
};
export {
  register, findUserByEmail, logout, findUserById, findAllUsers
};
