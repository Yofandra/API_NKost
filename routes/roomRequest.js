import {Router} from 'express'
import {createRoomRequest, RoomRequestAccept, RoomRequestRejected, getRoomRequest} from '../controllers/roomRequest-controller.js'
import {statusAccess, checkPermission, adminPermission} from "../middlewares/accountChecker.js";
import verifyToken from '../middlewares/authJwt.js';
const roomRequestRoute = Router()

roomRequestRoute.use(verifyToken)
roomRequestRoute.post('/create', createRoomRequest)
roomRequestRoute.put('/accept', RoomRequestAccept)
roomRequestRoute.put('/reject', RoomRequestRejected)
roomRequestRoute.get('/', getRoomRequest)


export default roomRequestRoute;