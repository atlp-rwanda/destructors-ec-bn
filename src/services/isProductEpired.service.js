import moment from 'moment'
import {Products} from '../database/models'
import { Emitter } from '../events/emmitEvent'
import { Sequelize } from 'sequelize'

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
        Emitter.emit('expiredProduct',isProductExpired)
    }

}
catch(error){
    console.log(error)
}
}

