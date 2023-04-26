import getSellerStats from '../services/stat.service.js';
import verfyToken from '../utils/verifytoken.js';

const GetSellerStats = async (req, res) => {
  try {
    const token = req.header('Authorization').split(' ')[1];
    const seller = verfyToken(token, process.env.JWT_SECRET);

    if (
      !seller ||
      !seller.data ||
      !seller.data.id ||
      seller.data.role !== 'seller'
    ) {
      return res.status(401).send({ message: 'Unauthorized User' });
    }
    const startTime = new Date('2023-04-08T16:00:00Z');
    const stats = await getSellerStats(seller.data.id, startTime);

    return res.status(200).json(stats);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: 'internal server error' });
  }
};

export default GetSellerStats;
