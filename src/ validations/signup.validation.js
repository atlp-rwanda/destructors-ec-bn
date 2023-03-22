import Joi from 'joi';
import PasswordComplexity from 'joi-password-complexity';

const validateForm = (schema) => (payload) => schema.validate(payload, { abortEarly: false });

const signUpSchema = Joi.object({
  firstname: Joi.string().min(1).trim().required(),
  lastname: Joi.string().min(1).trim().required(),
  email: Joi.string().email().trim().required(),
  password: new PasswordComplexity({
    min: 8,
    max: 15,
    lowerCase: 1,
    numeric: 1,
  }).required(),
});

const validatesignUp = validateForm(signUpSchema);

const signupValidation = (req, res, next) => {
  const { error } = validatesignUp(req.body);
  if (error) {
    res.status(400).json({
      status: 400,
      error: error.details.map((detail) => detail.message.replace(/[^a-zA-Z0-9 ]/g, '')),
    });
  } else {
    next();
  }
};
// const userProfileSchema = Joi.object({
//   gender:Joi.string().max(4).trim(),
//   DOB:Joi.date().less('1-1-1960'),
//   prefferedCurrency:Joi.string().uppercase(),
//   phoneNo:Joi.string().length(10).pattern(/^[0-9]+$/),
//   email:Joi.string().email().trim()
// })

export default signupValidation;
