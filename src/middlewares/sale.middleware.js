import {Sale } from "../database/models"

export const createSale = async (orderId,sellerId) => {
return await  Sale.create({
      orderId: orderId,
      sellerId: sellerId
    })}





