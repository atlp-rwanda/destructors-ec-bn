import { Products } from '../database/models';

const isProductExist = async (req, res, next) => {
  const { name } = req.body;
  const product = await Products.findOne({ where: { name } });

  if (product) {
    return res.status(404).json({
      message: 'Product is already exist, Please the update the stock instead',
    });
  }

  next();
};

export { isProductExist };
