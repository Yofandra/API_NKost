import {Router} from 'express'
import {createRoom, updateRoom, deleteRoom, getRoom} from '../controllers/room-controller.js'
import {statusAccess, checkPermission, adminPermission} from "../middlewares/accountChecker.js";
import verifyToken from "../middlewares/authJwt.js";

const roomRoute = Router()

roomRoute.use(verifyToken, statusAccess)

roomRoute.get('/', getRoom)
roomRoute.post('/create', createRoom)
roomRoute.put('/:id', updateRoom)
roomRoute.delete('/:id', deleteRoom)

export default roomRoute;

