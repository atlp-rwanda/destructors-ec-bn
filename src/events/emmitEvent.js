import events from 'events'
const Emitter = new events();
import { ExpiredProducts } from '../services/isProductEpired.service';

Emitter.on('expiredProduct',()=>{
    ExpiredProducts
})

Emitter.on('noExpiredProduct',(message)=>{
    console.log(message)
})

export {Emitter}
