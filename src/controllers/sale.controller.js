
import {Sales }from "../database/models";
import  { Orders, User } from '../database/models';
import { Products } from '../database/models';
import { eventEmitter } from "../events/eventEmitter";
import { sendEmail } from "../services/sendEmail.service";


const changeSaleStatus = async (req, res) => {
    try{
      const sellerId = req.user.id;
      const selectedSale = await Sales.findOne({where:{ id: req.params.id}});


      if (!selectedSale) {
        return res.status(404).json({ error: "Sale not found" });
      }

      const selectedOrder = await Orders.findOne({where:{id:selectedSale.orderId}})
      const orderProducts = selectedOrder.products;
      const buyerDetails = await User.findOne({where:{id: selectedOrder.userId }})
      let orderSellerIds= []
     orderProducts.map((data)=>{
    orderSellerIds.push(data.sellerId)
      })
      if (selectedSale.sellerId !== sellerId) {
       return res.status(401).json({ error: "this sale is not related to you" });  
    }


    const { newStatus} = req.body;
    if (!["rejected", "approved"].includes(newStatus)) {
      return res.status(400).json({ error: "Invalid status specified" });
    }

     await Sales.update(
      { status: newStatus },
      { where: { id: req.params.id } }
    );

    
  if (newStatus === "approved") {
    for (const orderSellerId of orderSellerIds) {

      const currentProduct = await Products.findOne({ where: { sellerId: orderSellerId } });
      const orderPquantity = orderProducts.find((data) => data.sellerId === orderSellerId).quantity;
      const newQuantity = currentProduct.quantity - orderPquantity;

      await Products.update({ quantity: newQuantity }, { where: { sellerId: orderSellerId } });
    }
    
        const subject = 'Order Status';
        const message = `Hi ${buyerDetails.lastname}, your order has been approved.
        Thank you for buying with us `
        const HTMLText = `<div> <div> <h3 style="color:#81D8F7;">Order Status</h3><br><p>${message}<br>Destructors</p> </div> </div>`;
        const notificationDetails = {
            receiver: selectedOrder.userId,
            subject,
            message,
            entityId: { saleId: selectedSale.id},
            receiverId: selectedOrder.userId
        }
        eventEmitter.emit('order-notification', notificationDetails);
        sendEmail(selectedOrder.email, subject, HTMLText );
    return res.status(200).json({ status:"sale approved successfully"}); 
  }
  const subject = 'Order Status';
  const message = `Hi ${buyerDetails.lastname}, your order has been rejected.
  Kindly contact the Destructors, thank you `
  const HTMLText = `<div> <div> <h3 style="color:#81D8F7;">Order Status</h3><br><p>${message}<br>Destructors</p> </div> </div>`;
  const notificationDetails = {
      receiver: selectedOrder.userId,
      subject,
      message,
      entityId: { saleId: selectedSale.id},
      receiverId: selectedOrder.userId
  }
  eventEmitter.emit('order-notification', notificationDetails);
  sendEmail(selectedOrder.email, subject, HTMLText );
    return res.status(200).json({ status:"sale rejected"}); 
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, error: error});
  
  }
}
export default changeSaleStatus;