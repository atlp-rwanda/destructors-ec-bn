/* eslint-disable no-unused-vars */
import { BcryptUtil } from "../utils/bcrypt";

const { User } = require("../database/models");

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

export { register };
