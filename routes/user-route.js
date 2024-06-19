import { Router } from "express";
import { register, login, forgetPassword, verifyAccount, resetPassword } from "../controllers/user-controller.js";
import verifyToken from "../middlewares/authJwt.js";
import {statusAccess, checkPermission, adminPermission} from "../middlewares/accountChecker.js";

const route = Router();

route.post('/register', register)
route.post('/login', login)
route.post('/reset-password/:token', resetPassword)
route.post('/forget-password', forgetPassword)
route.post('/verify-account', verifyAccount)

export default route