import { Products } from '../database/models';

const createProduct = async (product) => {
  await Products.create(product);
};

export { createProduct };
