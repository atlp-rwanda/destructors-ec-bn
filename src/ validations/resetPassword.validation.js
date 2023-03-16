import Joi from "joi";
import PasswordComplexity from "joi-password-complexity";

const validateForm = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

const resetPSchema = Joi.object({
  
  password: Joi.string(new PasswordComplexity({
    min: 8,
    max: 15,
    lowerCase: 1,
    numeric: 1,
  })).required(),
   confirmPassword: Joi.ref('password').required
});

const validatereset = validateForm(resetPSchema);

const resetPasswordValidation = (req, res, next) => {
  const { error } = validatereset(req.body);
  if (error) {
    res.status(400).json({
      status: 400,
      error: error.details.map((detail) =>
        detail.message.replace(/[^a-zA-Z0-9 ]/g, "")
      ),
    });
  } else {
    next();
  }
};

export default resetPasswordValidation;