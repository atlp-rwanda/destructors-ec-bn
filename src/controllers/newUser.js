import * as Users from "../database/models/index.js"
const createUser = async (req, res) => {
    try {
      const {email, name} = req.body;
      console.log("Mail: ",email , "Name: ",name) 
      
      const addUser= await Users.newUser.create(req.body);
      addUser.save()
      return res.status(201).json({
        addUser,
      });
    } catch (error) {
      return res.status(500).json({error: error.message})
    }
}
export default createUser