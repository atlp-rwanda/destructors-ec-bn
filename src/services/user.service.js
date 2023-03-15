/* eslint-disable no-unused-vars */
import { BcryptUtil } from '../utils/bcrypt';
import { Blacklist }from '../database/models';
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
  return user;
};

const findUserByEmail = async (email) => {

  const UserInfo = await User.findOne({where: {email: email}});

  if(UserInfo == null){
    return false;
  }else {
    return UserInfo;
  }

  
}


const logout = async (userData)=>{

  const token = userData.split(' ')[1]
  await Blacklist.create({token})
}
export { register,findUserByEmail,logout};
 
