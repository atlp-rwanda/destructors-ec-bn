/* eslint-disable quotes */
import Joi from "joi";
import PasswordComplexity from "joi-password-complexity";

const validateForm = (schema) => (payload) => schema.validate(payload, { abortEarly: false });

const resetPSchema = Joi.object({

  password: new PasswordComplexity({
    min: 8,
    max: 15,
    lowerCase: 1,
    numeric: 1,
  }).required(),
  confirmPassword: Joi.any().valid(Joi.ref('password')).required()
});

const EmailSchema = Joi.object({
  email: Joi.string().email().trim().required(),
});

const validatereset = validateForm(resetPSchema);

const resetPasswordValidation = (req, res, next) => {
  const { error } = validatereset(req.body);
  if (error) {
    res.status(400).json({
      status: 400,
      error: error.details.map((detail) => detail.message.replace(/[^a-zA-Z0-9 ]/g, "")),
    });
  } else {
    next();
  }
};

const validateEmail = validateForm(EmailSchema);

const EmailValidation = (req, res, next) => {
  const { error } = validateEmail(req.body);
  if (error) {
    res.status(400).json({
      status: 400,
      error: error.details.map((detail) => detail.message.replace(/[^a-zA-Z0-9 ]/g, "")),
    });
  } else {
    next();
  }
};
export {resetPasswordValidation, EmailValidation};
