import {
  createCategory,
  findAllCategories,
} from '../services/category.service';

const addCategories = async (req, res) => {
  try {
    const { name } = req.body;
    const category = {
      name: name.toLowerCase(),
    };
    const categories = await createCategory(category);
    return res
      .status(201)
      .json({ message: 'Category added successfully', category: categories });
  } catch (err) {
    return res
      .status(500)
      .json({ error: err.message, message: 'Something went wrong' });
  }
};
const getAllCategories = async (req, res) => {
  try {
    const categories = await findAllCategories();
    return res.status(200).json({ categories: categories });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
      message: 'Something went wrong when retrieving categories',
    });
  }
};

export { addCategories, getAllCategories };
