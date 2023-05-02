import { Products, User } from '../database/models';
import { Reviews} from '../database/models';

const createProduct = async (product) => {
  await Products.create(product);
};

const findProduct = async (id, role, sellerId) => {
  if (role == 'seller') {
    const product = await Products.findOne({ where: { id, sellerId } });
    console.log(product);
    if (product == null) {
      return false;
    }
    return product;
  } 
  
  if(role === 'admin'){
    const product = await Products.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: 'Seller',
          attributes: ['firstname', 'lastname', 'email'],
        },
      ],
    });

    if (product == null) {
      return false;
    }

    return product;
  }

  const product = await Products.findOne({
    where: { id, isExpired:false },
    include: [
      {
        model: User,
        as: 'Seller',
        attributes: ['firstname', 'lastname', 'email'],
      },
    ],
  });
  if (product == null) {
    return false;
  }
  return product;
};

const findProducts = async (role, sellerId,isExpired, size, page) => {
  if (role == 'seller') {
    const products = await Products.findAndCountAll({
      where: { sellerId },
      limit: size,
      offset: page * size,
    });
    if (products == null) {
      return false;
    }
    return products;
  }

  const products = await Products.findAndCountAll({
    where:{isExpired},
    include: [
      {
        model: User,
        as: 'Seller',
        attributes: ['firstname', 'lastname', 'email'],
      },
    ],
    limit: size,
    offset: page * size,
  });
  if (products == null) {
    return false;
  }
  return products;
};
const findProductById = async (id) => {
  return await Products.findByPk(id);
};
const findAllProducts = async (size, page) => {
  const products = await Products.findAndCountAll({
    limit: size,
    offset: page * size,
  });

  return products;
};

export const productReview = async (productId, buyerId, rating, feedback) => {
  const review = await Reviews.create({
    productId,
    buyerId,
    rating,
    feedback,
  });
  return review;
};

export { createProduct, findProduct, findProducts, findProductById, findAllProducts };
