import { Products, User } from '../database/models';

const createProduct = async (product) => {
  await Products.create(product);
};

const findProduct = async (id, role, sellerId) => {

  if(role == 'seller'){
    
   const product = await Products.findOne({where: { id, sellerId}});
   if (product == null){
    return false
  }
  return product;

  }

  const product = await Products.findOne({where: { id}});
  if (product == null){
    return false
  }
  return product;
};

const findProducts = async (role, sellerId) => {

  if(role == 'seller'){
    
    const products = await Products.findAll({
      where: {sellerId},
      include:[
        {
          model: User,
          as: 'Seller'
        }
      ]
    });
    if (products == null){
     return false
   }
   return products;
 
   }

  const products = await Products.findAll();
  if (products == null){
    return false
  }
  return products;
}
export { createProduct, findProduct, findProducts };
