import { createAwish } from "../services/addToWishList.service";
import  {Products,User,ProductWish} from "../database/models"
import verfyToken from "../utils/verifytoken";
import { generateToken } from "../utils/generateToken";
const { sequelize } = require('../database/models');

const addWishlist=async(req, res)=> {
    try {
        const token=req.header('Authorization').split(' ')[1]
        const userVerify=verfyToken(token,process.env.JWT_SECRET)
        if (!req.user) {
            return res.status(401).json({ message: "unauthorized user!" });
        }
        const { userId, productId } = req.body;
        const product = await Products.findByPk(productId);
         const user = await User.findByPk(userId);

        if (!product) {
           return res.status(400).json({ message: "product not found" });
        }
         if (userVerify.data.id !== user.id) {
             return res.status(401).json({ message: 'not permited!' });
           }
           
        const wishes = await ProductWish.findOne({ where: { userId, productId } });
        if (wishes) {
            console.log(wishes)
            await wishes.destroy();
            return res.status(200).json({ message: "product unwished  succesfully!" });
        }
        
        const wishedItem = {
            userId: user.id,
            productId: product.id
        };
        console.log(wishedItem)
        await createAwish(wishedItem);
        return res.status(201).json({
            message: 'product wished created successfull',
            wishedItemCreate: wishedItem,
        });
    }
    catch {
        return res.status(500).json({
            message: "something went wrong!"
        });
    }
}
const getProductWished=async(req,res)=>{
    try{
        const token=req.header('Authorization').split(' ')[1]
        const user=verfyToken(token,process.env.JWT_SECRET)
        if(!user){
            return res.status(400).json("unauthorized user !");
        }
        let productWishes
        if(user.data.role === "buyer"){
             productWishes=await ProductWish.findAll({where:{userId:user.data.id}})
            
            
        }
        else if(user.data.role==="seller"){
            productWishes=await ProductWish.findAll({
                attributes:[
                    'productId',
                    [sequelize.fn('count', sequelize.col('productId')), 'count']
                ],
                where:{userId:user.data.id},
                group:['productId']
            })
        }
        else{
            return res.status(403).json({ message: 'Forbidden' });
        }
        res.status(200).json({productWishes});
    }
   catch(error){
    res.status(500).json({message:error})
   }     
}
const getWishesPerProduct=async(req,res)=>{
    try{
        const token=req.header('Authorization').split(' ')[1]
        const user=verfyToken(token,process.env.JWT_SECRET)

     if(!user || user.data.role !=="seller"){
    return res.status(401).json("unAuthorized user !")
    }
     const {id:productId} = req.params
    const productWishes=await ProductWish.findAll({
        attributes: [
            'productId',
            [sequelize.fn('count', sequelize.col('productId')), 'count'],
          ],
          where: { productId},
          group: ['productId'],
    })
    return res.status(200).json(productWishes)
    }
    catch(error){
        res.status(500).json(error)
    }
    
}

export {addWishlist,getProductWished,getWishesPerProduct}