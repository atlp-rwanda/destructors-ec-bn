import verfyToken from "../utils/verifytoken";
import { eventEmitter } from "../events/eventEmitter";
export const checkIfPasswordIsExpired = (req,res,next)=>{
    const token = req.headers.authorization;
    const getToken = token.split(' ')[1]
    const decodedToken = verfyToken(getToken,process.env.JWT_SECRET)
    const expired = decodedToken.data.expired
    if(expired){
        return  res.status(201).json('your password has expires please update it!!')
    }
    next()
    eventEmitter.emit('response','Your Password has expired!! please update it')
}