import { Categories, Products } from '../database/models/index';
import upload from '../config/multer';

const isCategoryExist = async (req, res, next) => {
  const { categoryId } = req.body;
  const categories = await Categories.findOne({
    where: { id: categoryId },
  });

  if (!categories) {
    return res.status(404).json({ message: 'Category doesnt exist' });
  }
  next();
};

const isProductExist = async (req, res, next) => {
  const sellerId = req.user.id;
  const { name } = req.body;
  const product = await Products.findOne({ where: { name, sellerId } });

  if (product) {
    return res.status(404).json({
      message: 'Product is already exist, Please update the stock instead',
    });
  }

  next();
};

const uploadArray = (name) => async (req, res, next) => {
  try {
    upload.array(name)(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          status: 400,
          message: 'Something went wrong while trying to upload Image',
        });
      }
      next();
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Image upload error' });
  }
};

export { isCategoryExist, isProductExist, uploadArray };
