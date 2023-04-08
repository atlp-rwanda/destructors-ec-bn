import { createAwish } from "../services/addToWishList.service";
import  {Products,User,ProductWish} from "../database/models"
import verfyToken from "../utils/verifytoken";
const { sequelize } = require('../database/models');

const addWishlist=async(req, res)=> {
    try {
        const token=req.header('Authorization').split(' ')[1]
        const userVerify=verfyToken(token,process.env.JWT_SECRET)
        
        if (!req.user) {
            return res.status(401).json({ message: "unauthorized user!" });
        }
       
        const { productId } = req.body;
        const product = await Products.findByPk(productId);

        if (!product) {
           return res.status(400).json({ message: "product not found" });
        }
         if (!userVerify.data.id) {
             return res.status(401).json({ message: 'not permited!' });
           }
           
        const wishes = await ProductWish.findOne({ where: { productId,userId:userVerify.data.id } });
        if (wishes) {
            await wishes.destroy();
            return res.status(200).json({ message: "product unwished  succesfully!" });
        }
        if(userVerify.data.role==="buyer"){
        const wishedItem = {
            userId: userVerify.data.id,
            productId: product.id
        };
        await createAwish(wishedItem);
        return res.status(201).json({
            message: 'product wished created successfull',
            wishedItemCreate: wishedItem,
        });
    }
        else{
            return res.status(200).json({message:"only buyer are allowed!"})
        }
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
            return res.status(400).json({message:"unauthorized user !"});
        }
        let productWishes
        if(user.data.role === "buyer"){
             productWishes=await ProductWish.findAll({where:{userId:user.data.id}})
            
            
        }
        else if(user.data.role==="seller"){
            const sellerId=user.data.id
            productWishes=await ProductWish.findAll({
                  attributes: [
                    'productId',
                    [sequelize.fn('count', sequelize.col('productId')), 'count']
                  ],

                include: [{
                    model: Products,
                    where: {sellerId},
                    attributes:[]
                }],
                  group: ['productId']
                });
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
     const sellerId=user.data.id
    const productWishes=await ProductWish.findAll({
        attributes: [
            'productId',
            [sequelize.fn('count', sequelize.col('productId')), 'count'],
          ],
          include: [{
            model: Products,
            where: { sellerId, id: productId },
            attributes: []
          }],
          group: ['productId'],
    })
    if(!productId){
        res.status(200).send("product wish not found!")
    }
    return res.status(200).json(productWishes)
    }
    catch(error){
        res.status(500).json(error)
    }
    
}

export {addWishlist,getProductWished,getWishesPerProduct}