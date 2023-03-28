import { Products, User } from '../database/models';

const createProduct = async (product) => {
  await Products.create(product);
};

const findProduct = async (id, role, sellerId) => {



    if(role == 'seller'){
    
      const product = await Products.findOne({where: { id, sellerId}});
      console.log(product);
      if (product == null){
       return false
     }
     return product;
   
     }
   
     const product = await Products.findOne({
       where: { id},
       include:[
         {
           model: User,
           as: 'Seller',
           attributes: ['firstname', 'lastname', 'email']  
         }
       ]
     });
     if (product == null){
       return false
     }
     return product;
  
};

const findProducts = async (role, sellerId, size, page) => {

  if(role == 'seller'){
    
    const products = await Products.findAndCountAll({
      where: {sellerId},
    limit: size,
    offset: page * size
    });
    if (products == null){
     return false
   }
   return products;
 
   }

  const products = await Products.findAndCountAll({
    include:[
      {
        model: User,
        as: 'Seller',
        attributes: ['firstname', 'lastname', 'email']  
      }
    ],
    limit: size,
    offset: page * size
  }
  );
  if (products == null){
    return false
  }
  return products;
}
export { createProduct, findProduct, findProducts };
