import { Router } from "express";
import { updateUser, getUserById, register, login, deleteUser, forgetPassword, verifyAccount } from "../controllers/user-controller.js";
import verifyToken from "../middlewares/authJwt.js";
const route = Router();

route.put('/:id', verifyToken, updateUser)
route.get('/:id', getUserById)
route.post('/register', register)
route.post('/login', login)
route.delete('/delete/:id', verifyToken, deleteUser)
route.post('/reset-password', forgetPassword)
route.post('/verify-account', verifyAccount)

export default  route