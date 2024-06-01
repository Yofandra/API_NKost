import { Router } from "express";
import { register, login, forgetPassword, verifyAccount } from "../controllers/user-controller.js";

const route = Router();

route.post('/register', register)
route.post('/login', login)
route.post('/reset-password', forgetPassword)
route.post('/verify-account', verifyAccount)

export default  route