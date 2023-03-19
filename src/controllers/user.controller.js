import { register } from "../services/user.service";
import { generateToken } from "../utils/generateToken";
import sgMail from "@sendgrid/mail"
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
    const url=`http://localhost:3000/api/v1/users/protected/${token}`
    const apikey=process.env.API_KEY
    sgMail.setApiKey(apikey)
    const message={
      to:['calvinusBukaran@gmail.com'],
      from:{
        name:'destructors-team',
        email:'calvinusbukaran@gmail.com'
      },
      subject:'click here to comfirm',
      text:'this is the message from sendgrid',
      html:`<h3>click the link below for comfirmation :</h3><br><a href="${url}">${url}</a>`
    }
    sgMail.send(message)
    .then(res=>console.log('message sent..'))
    .catch(error=>console.log(error))
    return res
      .status(201)
      .json({ message: "Successful registered", user: response, token: token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, error: "Server error" });
  }
};

export { registerUser };
