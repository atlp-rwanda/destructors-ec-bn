<<<<<<< HEAD
import { register, findUserByEmail,logout } from "../services/user.service";
import { generateToken } from "../utils/generateToken";
import passport from "passport";
import { User } from "../database/models";
import { BcryptUtil } from '../utils/bcrypt';
import model from "../database/models/index.js";
import "dotenv/config";
import { verifyToken } from "../utils/verifyToken";
import sendEmail from "../services/sendEmail.service";
import { request } from "express";

=======
import { register , updateUser} from "../services/user.service";
import { generateToken } from "../utils/generateToken";
import User from "../database/models/index";
// import jwt from "jsonwebtoken"
import passport from 'passport';
// import { User } from '../database/models';
import { BcryptUtil } from '../utils/bcrypt';
>>>>>>> Admin change user status and assign roles to users

const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password, role, isActive } = req.body;

    const userData = {
      firstname,
      lastname,
      email,
      password,
      role,
      isActive,
    };
    const token = generateToken(userData);
    const response = await register(userData);
    return res
      .status(201)
      .json({ message: "Successful registered", user: response, token: token });
  } catch (error) {
    return res.status(500).json({ status: 500, error: "Server error" });
  }
};
const loginUser = async (req, res, next) => {
  passport.authenticate('local', async (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    try {
      const foundUser = await User.findOne({ where: { email: user.email } });
      if (!foundUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      const passwordMatches = await BcryptUtil.compare(req.body.password, user.password);

      if (!passwordMatches) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      const UserToken = {
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        
      };
      const token = generateToken(UserToken);

      return res.status(200).json({
        message: 'Successful login',
        user: {
          id: foundUser.id,
          firstname: foundUser.firstname,
          lastname: foundUser.lastname,
          email: foundUser.email,
          role: foundUser.role,
        },
        token: token,
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};

 const resetEmail = async (req, res) => {
  try {
  
   const userEml = req.body.email;
   const user = await findUserByEmail(userEml);
    if (user == false) {
      res.status(404).json("User not found");
    } else {
      const userDetails = {
        email: user.email,
        id: user.id

      }
      const userToken = generateToken(userDetails, { expiresIn: '10m' });
      const sendToEmail = req.body.email;
      const HTMLText = `<p stlye="font-size: 30px"><strong> Hi <br> <br>
           Please click on this link below to reset your password:<br> ${userToken}<br>Remember, beware of scams and keep this one-time verification link confidential.<br>
            Thanks, </strong><br> DESTRUCTORS </p>`;

     await sendEmail(sendToEmail, 'Reset password', HTMLText);

      res.status(200).json({ message: "Reset password email has been sent, check your inbox"});
    }
  } catch (error) {
    res.status(500).json({error: "Server error"});
  }
};

 const resetPassword = async (req, res) => {
  try {
    const token = req.params.token;
      const payload = verifyToken(token, process.env.JWT_SECRET)

      console.log("payload", payload)

      if (payload) {

        const hashPassword = BcryptUtil.hash(req.body.password);
       await model.User.update({
          password: hashPassword
        }, {
          where: { email: payload.data.email }
        });
        res.status(200).json({ message: 'Password changed successfully' });

      } else {
        res.status(400).json({ message: 'Token has expired' });
      }
   
  } catch (error) {
    
    res.status(500).json({error: "Server error"});
  }
};


const editUserProfile = async(req,res)=>{
  try{
    const userEmail = req.user.email
    const decodeUser =await findUserByEmail(userEmail);

    if(!decodeUser) return res.status(401).json("user not found");
        let billingAddress
           billingAddress = JSON.stringify({
              province:req.body.province,
              district:req.body.district,
              street:req.body.street,
              phoneNo:req.body.phoneNo,
              email:req.body.email
          })
          let profilePic
          if(req.body.gender === 'male'){
            profilePic ='https://res.cloudinary.com/ddsml4rsl/image/upload/v1679487826/icons8-administrator-male-90_dlmsde.png'
          }
          if(req.body.gender === 'female'){
            profilePic ='https://res.cloudinary.com/ddsml4rsl/image/upload/v1679487628/icons8-female-user-150_lwhby0.png'
          }
          const user = await User.update({
            DOB:req.body.DOB,
            gender:req.body.gender,
            prefferedLanguage:req.body.prefferedLanguage,
            prefferedCurrency:req.body.prefferedCurrency,
            billingAddress:JSON.parse(billingAddress),
            profilePic
          },{where:{id:decodeUser.id}})
          res.status(200).json({message:"User profile updated successfully"})
  }catch(error){
    res.status(500).json({message:error})
  }
}


const logoutUser = async(req,res) => {
try {

  await logout(req.headers.authorization)
  return res.status(200).json({ 
    message: 'Successfully logged out.', 
  });
} catch (error) {
  res.status(500).json({ message: error });
}
}
export { registerUser, resetEmail, resetPassword, loginUser ,editUserProfile,logoutUser };

