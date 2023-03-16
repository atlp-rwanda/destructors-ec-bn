import model from "../database/models"
import Jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateToken";
import "dotenv/config"
const sgMail = require('@sendgrid/mail')
const apiKey = process.env.API_KEY
sgMail.setApiKey(apiKey)


export const resetEmail = async (req, res) =>{

    const userEmail = await model.User.findOne({where:{email: req.body.email}})

    if(!userEmail){
        res.json("User not found")
    } else {
        const userToken = generateToken(userEmail, {expiresIn: '10m'})
           console.log(userToken)

           const message = {
            to: req.body.email,
            from:{
              name: "SIMPLE-API",
              email: "katros15o@gmail.com"
            },
            subject:'Reset password',
            text:userToken
          }
          sgMail
          .send(message)
          .then(res =>  console.log('email sent...'))
          .catch((error) => console.log(error.message))


        const newUser = await model.ResetPassword.create({
            email:req.body.email,
            token:userToken
        })


        res.json({message:"check ur email", token:userToken})
    }
      


}

export const resetPassword = async (req, res) => {
try{
  const token = req.params.token;
    const usr = await model.ResetPassword.findOne({where:{token: token}})
    if(!usr){
        res.status(400).json("user not found")
    } else{
        const plyload = Jwt.verify(token, process.env.JWT_SECRET, (error, decodedToken) => {
          if(error) {
            res.status(400).json({ message: 'Incorrect token or expired' })
            
          }else{
            return decodedToken;
          }
     })

    console.log(plyload)
      if(plyload) { 
        
        const [ updated ] = await model.User.update({
            email:usr.email,
            password:req.body.password
            }, {
      where: { email: usr.email }
    });
     res.status(200).json({ message: 'password changed successfully' })
    } 
    }
  } catch(error){

    console.log(error)
    res.status(500).json('server error');
  } 
  


   

}