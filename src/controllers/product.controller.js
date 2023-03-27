/* eslint-disable object-curly-newline */
import { createProduct, findProduct, findProducts } from '../services/product.service.js';
import verfyToken from '../utils/verifytoken.js';
import 'dotenv/config';

const createProducts = async (req, res) => {
  try {
    const { name, price, quantity, bonus, expiryDate, categoryId } = req.body;
    const images = req.files.map((img) => img.path);
    const sellerId = req.user.id;
    const productDetails = {
      name,
      price,
      quantity,
      bonus,
      expiryDate,
      categoryId,
      sellerId,
      images,
    };

    const product = await createProduct(productDetails);
    return res.status(201).json({
      message: 'Products created successfull',
      product: productDetails,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: err.message, message: 'Something went wrong' });
  }
};

const retrieveItem = async (req, res) => {
  const itemId = req.params.id;
  const token = req.header('Authorization').split(' ')[1];
 const user = verfyToken(token, process.env.JWT_SECRET);
console.log(user.data.role);
 if (user.data.role == 'seller'){
  const item = await findProduct(itemId, 'seller', user.data.id);
  console.log(item);
  console.log(user.data.id);
  if(!item){
    return res.status(400).json({message: "This product is not found in your collection"})
  }

  return res.status(200).json({item})

 }

 if (user.data.role == 'buyer'){
  const item = await findProduct(itemId);
  return res.status(200).json({item})

 }

};

const retrieveItems = async (req, res) => {
  const itemId = req.params.id;
  const token = req.header('Authorization').split(' ')[1];
 const user = verfyToken(token, process.env.JWT_SECRET);
console.log(user.data.role);
 if (user.data.role == 'seller'){
  const items = await findProducts('seller',user.data.id);
  console.log(items);

  
  return res.status(200).json({items})

 }

 if (user.data.role == 'buyer'){
  const items = await findProducts()
  return res.status(200).json({items})

 }

}

export { createProducts, retrieveItem, retrieveItems };
