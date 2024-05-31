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

// exports.verifyToken = (req, res, next) => {
//   try {
//     const authHeader = req.headers["authorization"];
//     if (!authHeader)
//       return res.status(401).json({
//         message: "Silahkan Login Terlebih Dahulu",
//       });

//     const token = authHeader && authHeader.split(" ")[1];
//     if (!token)
//       return res.status(401).json({
//         message: "Silahkan Login Terlebih Dahulu",
//       });

//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//       if (err) {
//         if (err instanceof jwt.TokenExpiredError) {
//           return res.status(401).json({
//             message: "Token kedaluwarsa, silahkan login ulang",
//           });
//         } else if (err instanceof jwt.JsonWebTokenError) {
//           return res.status(401).json({
//             message: "Token tidak valid. Silahkan login ulang",
//           });
//         } else {
//           console.log(err);
//           return res.status(500).json({
//             message: "Kesalahan pada internal server",
//           });
//         }
//       } else {
//         res.locals.user = decoded;
//         return next();
//       }
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Kesalahan pada internal server",
//     });
//   }
// };
