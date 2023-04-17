import moment from 'moment'
import {Products, User} from '../database/models'
import { Emitter } from '../events/emmitEvent'
import { Sequelize } from 'sequelize'
import { eventEmitter } from '../events/eventEmitter'
import { sendEmail } from './sendEmail.service'

export const ExpiredProducts=async()=>{
    try{
    const isProductExpired=await Products.findAll({where:{
        expiryDate:{
            [Sequelize.Op.lt]: moment().subtract(process.env.EXPIRESIN,process.env.TIMEUNITS)
          },
          isExpired:false
    }})
           
    if (isProductExpired && isProductExpired.length>0){
        await Products.update({isExpired:true},{where:{
            expiryDate:{
                [Sequelize.Op.lt]: moment().subtract(process.env.EXPIRESIN,process.env.TIMEUNITS)
              }
        }})
        Emitter.emit('expiredProduct',isProductExpired);
        isProductExpired.forEach(async (element) => {
            const sellerDetails = await User.findOne({where: {id: element.sellerId}});
            const notificationDetails = {
                receiver:element.sellerId,
                subject:'Product Expiration',
                message: `This ${element.name} has expired and removed from list of available products`,
                entityId: { productId: element.id},
                receiverId:element.sellerId
               } 
            const HTMLText = `<div> <div> <h3 style="color:#81D8F7;">Product Expiration</h3><br><p>${notificationDetails.message}<br>Destructors</p></div> </div>`;
            eventEmitter.emit('expired-notification', notificationDetails )
            sendEmail(sellerDetails.email, notificationDetails.subject, HTMLText )
        });
        
    }
    else{
        Emitter.emit('noExpiredProduct','there is no expired product!!')
    }

}
catch(error){
    console.log(error)
}
}

