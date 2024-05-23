import jwt from "jsonwebtoken";
import roleAccess from "./roleAccess.js";
import errorHandler from "../middlewares/errorHandler.js";

const authJwt = (req, res, next) => {
  const token = req.headers["authorization"]?.replace("Bearer ", "");
  if (!token) {
    const error = new Error("Missing_Token");
    return errorHandler(error, req, res);
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      const error = new Error("Invalid_Token");
      return errorHandler(error, req, res);
    }
    req.userId = decoded.userId;
    
    if (!roleAccess(decoded.role, req.baseUrl, req.method)) {
      const error = new Error("Unauthorized");
      return errorHandler(error, req, res);
    }
    next();
  });
};

export default authJwt;
