import Joi from 'joi';

const reviewProductSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  feedback: Joi.string().min(5).max(2000).required(),
});
export const validateReviewProduct = (req, res, next) => {
   const { error } = reviewProductSchema.validate(req.body ,{
     abortEarly: false,
      });
      if (error) {
        return res.status(400).json({
         error: error.details[0].message.replace(/[^a-zA-Z0-9 ]/g, ''),
        });
      }
    next();
  };