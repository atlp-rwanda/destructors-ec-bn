import { getCart } from "../services/cart.service";
import { getCartProducts } from '../services/cart.service';

export const getCartProductInfo =async (req,res,next)=>{
    const {id} = req.user
    const cart =await getCart(id)
    if(!cart) return res.status(403).json({message:'Your cart is empty please add some thing'})
    const {products} = cart
    const productsId = products.map((product) => product.productId);
    const productInfo = await getCartProducts(productsId);
    const productAllInfo = productInfo.map((product, index) => ({
        name: product.name,
        price: product.price,
        image: product.images,
        quantity: products[index].quantity,
        sellerId: product.sellerId,
    }));
    req.productAllInfo = productAllInfo
    await next()
}