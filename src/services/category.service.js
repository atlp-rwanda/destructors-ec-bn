import { Categories } from '../database/models';

const createCategory = async (category) => {
  return await Categories.create(category);
};

const findAllCategories = async () => {
  return await Categories.findAll({});
};

export { createCategory, findAllCategories };
