import { createAwish } from "../services/addToWishList.service";
import  {Products,User,ProductWish} from "../database/models"
import { where } from "sequelize";

const addWishlist=async(req,res)=>{
    
    try{
       if(!req.user){
        return res.status(401).json({message:"unauthorized user!"})
       }
       const {userId,productId}=req.body
      const product=await Products.findByPk(productId)
      const user=await User.findByPk(userId)
      //let's check if the product already exists 
      if(!product){
        res.status(400).json({message:"product not found"})
      }
      const wishes=await ProductWish.findOne({where:{userId,productId}})
      if(wishes){
        await wishes.destroy()
        return res.status(200).json({message:"product wish removed succesfully!"})
      }
      const wishedItem={
        userId:user.id,
        productId:product.id
      }
        const wishedItemCreate=await createAwish(wishedItem)
        return res.status(201).json({
            message: 'wishlist item created successfull',
            wishedItemCreate: wishedItem,
          });
          
    }
    catch(err){
        res.status(500).json({
            error:err.message,
            message:"something went wrong!"
        })
    }
}
const getProductWished=async(req,res)=>{}
export {addWishlist}