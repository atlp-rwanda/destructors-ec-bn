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







//   const isAdmin = async (req, res, next) => {
//   try {
//     const userId = req.params.id; // Get the user ID from the request URL
//     const user = await getUserById(userId); // Retrieve the user's information from the database
//     if (user && user.role === 'admin') {
//       req.user = user; // Set the user object on the request
//       next(); // User is an admin, continue to the next middleware
//     } else {
//       res.status(403).send('Forbidden'); // User is not an admin, send a 403 Forbidden response
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Internal Server Error');
//   }
// };
// export default isAdmin