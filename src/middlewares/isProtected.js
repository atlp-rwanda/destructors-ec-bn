import User from "../database/models/index.js"
import "../services/googleAuth.js"
const isProtected=(req,res)=>{
    res.send(`<h2>welcome to my data</h2><br>${User.User.firstname}`)
    console.log(req.user)
}
export default isProtected