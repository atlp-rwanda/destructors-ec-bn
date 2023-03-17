import Jwt from "jsonwebtoken";

const verifyToken = (token, env) => {
    const payload = Jwt.verify(token, env, (error, decodedToken) => {
        if (error) {
          return false;
        } else {
          return decodedToken;
        }
      });

      return payload;

}

export { verifyToken };
