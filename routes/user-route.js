// const express = require('express')
// const { updateUser, getUserById, register, login } = require("../controllers/user-controller")
// const route = express.Router()

import { Router } from "express";
import { updateUser, getUserById, register, login } from "../controllers/user-controller.js";
const route = Router();

route.put('/:id',updateUser)
route.get('/:id', getUserById)
route.post('/', register)
route.post('/login', login)

export default  route