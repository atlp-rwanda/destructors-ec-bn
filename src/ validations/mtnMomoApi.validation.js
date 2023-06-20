import Joi from 'joi';

const transactionSchema = Joi.object({
  amount: Joi.number().positive().required(),
  orderId: Joi.string().required(),
});

const validateTransaction = (req, res, next) => {
  const { error } = transactionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export default validateTransaction;
