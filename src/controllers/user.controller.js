import { register } from "../services/user.service";
import { generateToken } from "../utils/generateToken";
const { User } = require("../database/models");

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
    console.log(error);
    return res.status(500).json({ status: 500, error: "Server error" });
  }
};

//profile page settings

const userProfile = async (req,res)=>{
  const user = await User.findOne({where:{email:"email@test1.com"}})
  .then(async(result)=>{
    const user1 = {
      firstname:req.body.firstname,
      lastname:req.body.lastname,
      email:req.body.email,
      location : req.body.location,
      currency:req.body.currency,
      gender:req.body.gender,
      language:req.body.language,
      DOB:req.body.DOB,
      billingAddress: {
        name:req.body.billingAddress.name,
        receiver:req.body.billingAddress.receiver
      }
    }
    if(result){
      await User.update(user1,{where:{id:result.id}});
      res.status(201).json({message:"User Update successfully",user:user});
    }else{
      res.status(400).json({message:"User not found"})
    }
  })
}

export { registerUser,userProfile };
