const express = require('express')
const { updateUser, getUserById, register, login } = require("../controllers/user-controller.js")
const route = express.Router()

route.put('/:id',updateUser)
route.get('/:id', getUserById)
route.post('/', register)
route.get('/', login)
module.exports = route