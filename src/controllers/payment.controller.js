import Stripe from "stripe";
import 'dotenv/config';
import culculateProductTotal from "../utils/cart";
import { createOrder,destroyCart } from "../middlewares/payment.middleware";

const stripe =Stripe(process.env.KEY_SECRET)
let paymentId 
const userPayment =async (req,res)=>{
    try{
        const carts = req.cart
        const cartId = carts.id
        const {email,firstname,billingAddress,id} = req.user
        const productAllInfo = req.productAllInfo
        const products = productAllInfo
        const productInfo = products.map(data => ({name:data.name,quantity:data.quantity,price:data.price,total:(data.quantity*data.price)}))
        const cartTotal = culculateProductTotal(productAllInfo);
        await stripe.customers.create({
            email:email,
            name:firstname
        })
        .then(async() => {
            let paymentMethod = await stripe.paymentMethods.create({
                type:'card',
                card:{
                    number:req.body.number,
                    exp_month:req.body.exp_month,
                    exp_year:req.body.exp_year,
                    cvc:req.body.cvc
                }
            })
            const pay = await stripe.paymentIntents.create({
                payment_method:paymentMethod.id,
                amount: cartTotal*100,
                currency: process.env.CURRENCY,
                description:"payment",
                confirm:true,
                payment_method_types:['card']
            })
            paymentId = pay.id
            await createOrder(paymentId,id,email,cartTotal,productAllInfo,billingAddress)
            await destroyCart(cartId)
            res.status(200).json({message:`you have paid ${cartTotal} ${process.env.CURRENCY} for:`,productInfo})
        })
}catch(e){
    res.status(403).json({message:'this error has happened',err:e})
}
}
export {userPayment}