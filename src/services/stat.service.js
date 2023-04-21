import {Op} from 'sequelize'
import  { Products, ProductWish,Sales ,Orders} from '../database/models';



const getSellerStats =async (sellerId, startTime)=>{
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const stats = [];

let year = startTime.getFullYear();
let month = startTime.getMonth() + 1;

while (year < currentYear || (year === currentYear && month <= currentMonth)) {
  const nextMonth = month === 12 ? new Date(year + 1, 1, 1) : new Date(year, month, 1);
  
  const productsSold = await Sales.findAll({
    where: {
      sellerId,
      status: 'payed',
      updatedAt: {
        [Op.between]: [new Date(year, month - 1, 1), nextMonth],
      },
    },
    include: [
      {
        model: Orders,
        as: 'order',
        attributes: ['amount']
      }
    ]
  });
  console.log(productsSold)
  const productsSoldRevenue = productsSold.reduce((total, product) => {
    return total + product.order.amount;
  }, 0)
  console.log(productsSoldRevenue)

  const expiredProducts = await Products.findAll({
    where: {
      sellerId,
      isExpired: true,
      expiryDate: {
        [Op.between]: [new Date(year, month - 1, 1), nextMonth],
      },
    },
  });

  const lostProductsRevenue = expiredProducts.reduce((total, product) => {
    return total + product.price;
  }, 0);

    const getProductWishes = await ProductWish.findAll({
          attributes:[
              'productId',
          ],
          include: [{
            model: Products,
            as: 'Product',
            where: {
              sellerId,
              createdAt: {
                [Op.between]: [new Date(year, month - 1, 1), nextMonth],
              },
            },
            attributes:[]
        }],
          group:['productId']
        })

  const monthName = new Date(year, month - 1, 1).toLocaleString('default', { month: 'long' });
  stats.push({
    year: year.toString(),
    month: monthName,
    productsSold: productsSold.length,
    productsSoldRevenue,
    expiredProducts: expiredProducts.length,
    lostProductsRevenue,
    getProductWishes: getProductWishes.length
  });

  month++;
  if (month > 12) {
    year++;
    month = 1;
  }
}

return stats 

}

export default getSellerStats