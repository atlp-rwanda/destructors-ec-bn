import PasswordComplexity from 'joi-password-complexity';
import Joi from 'joi';

const updatePasswordValidation = (req, res, next) => {
  const schema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: new PasswordComplexity({
      min: 8,
      max: 15,
      lowerCase: 1,
      numeric: 1,
    }),
    confirmPassword: Joi.string()
      .required()
      .valid(Joi.ref('newPassword'))
      .messages({
        'any.only': 'Passwords do not match',
      }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    const message = error.details.map((detail) => detail.message).join(', ');
    return res.status(400).json({
      success: false,
      error: message,
    });
  }

  return next();
};

export default updatePasswordValidation;
