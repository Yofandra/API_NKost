import {Router} from 'express'
import {createRoom, updateRoom, deleteRoom, getRoom, getRoomByIdUser, getRoomByIdKost, getRoomById} from '../controllers/room-controller.js'
import {statusAccess, checkPermission, adminPermission} from "../middlewares/accountChecker.js";
import verifyToken from "../middlewares/authJwt.js";

const roomRoute = Router()

roomRoute.use(verifyToken, statusAccess)

roomRoute.get('/', getRoom)
roomRoute.get('/user', getRoomByIdUser)
roomRoute.get('/kost/:id', getRoomByIdKost)
roomRoute.post('/', createRoom)
roomRoute.put('/:id', updateRoom)
roomRoute.delete('/:id', deleteRoom)
roomRoute.get('/:id', getRoomById)

export default roomRoute;

