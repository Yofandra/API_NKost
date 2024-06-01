// const express = require('express')
// const { updateUser, getUserById, register, login } = require("../controllers/user-controller")
// const route = express.Router()

import { Router } from "express";
import { updateUser, getUserById, register, login, deleteUser, forgetPassword, verifyAccount } from "../controllers/user-controller.js";
const route = Router();

route.put('/:id',updateUser)
route.get('/:id', getUserById)
route.post('/register', register)
route.post('/login', login)
route.delete('/delete/:id', deleteUser)
route.post('/reset-password', forgetPassword)
route.post('/verify-account', verifyAccount)

export default  route