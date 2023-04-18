// import { verifyToken } from "../utils/verifyToken";
import { getUserByEmail } from "../services/user.service";
import verifytoken from "../utils/verifytoken";

const isAdmin = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = req.headers.authorization;
    const decodedToken = verifytoken(token)
    const userId = decodedToken.userId;
    const user = await getUserByEmail(userId);
    if (user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, error: "Server error" });
  }
};
export default isAdmin
