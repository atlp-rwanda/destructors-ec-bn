import Sale from "../database/models/index";




const changeSaleStatus = async (req, res) => {
    try{
      const sellerId = req.user.id;
      const selectedSale = await Sale.Sale.findOne({where:{ id: req.params.id}});
    if (selectedSale.sellerId !== sellerId) {
       return res.status(401).json({ error: "this sale is not related to you" });  
    }
    if (!selectedSale) {
      return res.status(404).json({ error: "Sale not found" });
    }

    const { newStatus} = req.body;
    if (!["rejected", "approved"].includes(newStatus)) {
      return res.status(400).json({ error: "Invalid status specified" });
    }

     await Sale.Sale.update(
      { status: newStatus },
      { where: { id: req.params.id } }
    );


    return res.status(200).json({ user:"sale status updated successfully"}); 
  } catch (error) {
    return res.status(500).json({ status: 500, error: error});
  }
}
export default changeSaleStatus;