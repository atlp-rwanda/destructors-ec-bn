import {ProductWish} from '../database/models'

const createAwish=async(wishes)=>{
    await ProductWish.create(wishes)
};
export {createAwish}