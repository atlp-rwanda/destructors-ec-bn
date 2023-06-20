const calculateTotalAmount = (products) => {
    const totalAmount = products.reduce((acc, product) => acc + product.price, 0);
    return totalAmount;
  };
  
  export { calculateTotalAmount };
  