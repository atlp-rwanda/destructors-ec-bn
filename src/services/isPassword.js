
import {User} from '../database/models';
import Sequelize from 'sequelize';
import moment from 'moment';
import { eventEmitter } from '../events/eventEmitter';

export const checkPasswordExpiration = async ()=>{
  const expiredUsers = await User.findAll({where:{
    lastTimePasswordUpdated : {
      [Sequelize.Op.lt]: moment().subtract(process.env.EXPIRESIN,process.env.TIMEUNITS)
    }
  }})
  if(expiredUsers){
    await User.update({expired:true},{where:{
      lastTimePasswordUpdated : {
        [Sequelize.Op.lt]: moment().subtract(process.env.EXPIRESIN,process.env.TIMEUNITS)
      }
    }})
    eventEmitter.emit('passwordExpiration','Your password has expired!!')
  }
}