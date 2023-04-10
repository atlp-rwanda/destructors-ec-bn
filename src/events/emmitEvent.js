import events from 'events'
const Emitter = new events();
import { ExpiredProducts } from '../services/isProductEpired.service';

Emitter.on('expiredProduct',()=>{
    ExpiredProducts
})
export {Emitter}