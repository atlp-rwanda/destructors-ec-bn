/* eslint-disable no-unused-vars */
import Jwt from "jsonwebtoken";

const generateToken = (data, options) => {
  const token = Jwt.sign({ data }, process.env.JWT_SECRET, options);
  return token;
};
export { generateToken };
