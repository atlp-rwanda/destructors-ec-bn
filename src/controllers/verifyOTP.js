import { Op } from "sequelize";
import {User,OTP} from "../database/models";
import verfyToken from "../utils/verifytoken";
import "dotenv/config"
const verifyOTP=async(req,res)=>{
    try{
    const token=req.params.token
    const verToken=verfyToken(token,process.env.JWT_SECRET)
    if(!verToken){
        return res.status(401).json("unauthorized")
    }
    const {email,otp}=req.body
     const user=await OTP.findOne({
        where:{
            otp:otp,
            createdAt:{
                [Op.gte]:new Date(new Date()-10*60*1000),
            },
        },
    })
    if(!user){
        return res.status(200).send("invalid OTP!")
    }
    //clear the otp and log the user in
    else{
    user.otp=null;
    await user.save()
    res.status(200).send("logged in successfully")
    }
}
catch(error){
    res.send("server error!")
}
}
export default verifyOTP