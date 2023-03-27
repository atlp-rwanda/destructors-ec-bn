/* eslint-disable object-curly-newline */
import { createProduct, findProduct, findProducts } from '../services/product.service.js';
import verfyToken from '../utils/verifytoken.js';
import 'dotenv/config';
import { Op } from 'sequelize';
import {Products } from '../database/models';

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

  try {

  const itemId = req.params.id;
  const token = req.header('Authorization').split(' ')[1];
  const user = verfyToken(token, process.env.JWT_SECRET);

  if (user.data.role == 'seller'){

  const item = await findProduct(itemId, 'seller', user.data.id);

  if(!item){

    return res.status(404).json({message: "This product is not found in your collection"})
  }

  return res.status(200).json({item})

 }

 if (user.data.role == 'buyer' || user.data.role == 'admin'){
  const item = await findProduct(itemId);

  if(!item){

    return res.status(404).json({message: "This product is not found"})
  }
  return res.status(200).json({item})

 }

} catch(error){
  res.status(500).json(error)
  }

};

const retrieveItems = async (req, res) => {

  try {

  const token = req.header('Authorization').split(' ')[1];
  const user = verfyToken(token, process.env.JWT_SECRET);
  const pageAsNumber = Number.parseInt(req.query.page);
  const sizeAsNumber = Number.parseInt(req.query.size);

  let page = 0;
  if(!Number.isNaN(pageAsNumber) && pageAsNumber > 0){
    page = pageAsNumber;
  }

  let size = 10;
  if(!Number.isNaN(sizeAsNumber) && !(sizeAsNumber > 10) && !(sizeAsNumber < 1)){
    size = sizeAsNumber;
  }

 if (user.data.role == 'seller'){
  const items = await findProducts('seller', user.data.id, size, page);
  if(items.rows.length === 0){

    return res.status(200).json({message: "The collection is empty"})
  }
  
  return res.status(200).json({items: items.rows, totalPages: Math.ceil(items.count / Number.parseInt(size))})

 }

 if (user.data.role == 'buyer'){
  const items = await findProducts('','',size,page);

  if(items.length === 0){

    return res.status(200).json({message: "The store is empty"})
  }

  return res.status(200).json({items: items.rows, totalPages: Math.ceil(items.count / Number.parseInt(size))})

 }

} catch(error){
  res.status(500).json('Server Error')
  }

};


const searchProducts = async (req, res) => {
  try {
    const { name, minPrice, maxPrice, categoryId, bestBefore } = req.query;

    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (minPrice) where.price = { [Op.gte]: minPrice };
    if (maxPrice) where.price = { ...where.price, [Op.lte]: maxPrice };
    if (categoryId) where.categoryId = categoryId;
    if (bestBefore) where.expiryDate = { [Op.lt]: new Date(bestBefore) };

    const products = await Products.findAll({ where });
    return res.status(200).json({ products });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
export { createProducts, retrieveItem, retrieveItems, searchProducts};

