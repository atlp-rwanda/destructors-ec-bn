import Joi from "joi";
import errorMessage from "../utils/validationErrors";
const userProfileSchema = Joi.object({
    gender:Joi.string().max(4).trim().messages(errorMessage('email')),
    DOB:Joi.date().less('1-1-2100').messages(errorMessage('email')),
    prefferedCurrency:Joi.string().uppercase().messages(errorMessage('email')),
    prefferedLanguage:Joi.string().messages(errorMessage('email')),
    billingAddress:{
        street:Joi.string().max(20).messages(errorMessage('street')),
        province:Joi.string().max(20).messages(errorMessage('province')),
        district:Joi.string().max(20).messages(errorMessage('district')),
        phoneNo:Joi.string().length(10).pattern(/^[0-9]+$/).messages(errorMessage('phone')),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
     .messages(errorMessage('email'))
    }
  })
export {userProfileSchema}