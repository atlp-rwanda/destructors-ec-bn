import { jwt } from "jsonwebtoken";
const tokenVerify=(req, res) => {
  const token = req.cookies.token;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const email = decoded.email;
  res.send({email:email})
  
}
export {tokenVerify}