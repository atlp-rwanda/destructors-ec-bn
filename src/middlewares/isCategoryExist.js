import { Categories } from '../database/models';

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

export { isCategoryExist };
