import Joi from 'joi';
import PasswordComplexity from 'joi-password-complexity';

const validateForm = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

const updatePSchema = Joi.object({
  password: new PasswordComplexity({
    min: 8,
    max: 15,
    lowerCase: 1,
    numeric: 1,
  }).required(),
  passwordConfirm: Joi.any().valid(Joi.ref('password')).required(),
});

const validateUpdate = validateForm(updatePSchema);

const updatePasswordValidation = (req, res, next) => {
  const { error } = validateUpdate(req.body);
  if (error) {
    res.status(400).json({
      status: 400,
      error: error.details.map((detail) =>
        detail.message.replace(/[^a-zA-Z0-9 ]/g, '')
      ),
    });
  } else {
    next();
  }
};

export default updatePasswordValidation;
