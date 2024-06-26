import {Router} from 'express'
import {createRoomRequest, RoomRequestAccept, RoomRequestRejected, getRoomRequest, getRoomRequestByKostId} from '../controllers/roomRequest-controller.js'
import {statusAccess, checkPermission, adminPermission} from "../middlewares/accountChecker.js";
import verifyToken from '../middlewares/authJwt.js';
const roomRequestRoute = Router()

roomRequestRoute.use(verifyToken, statusAccess)
roomRequestRoute.post('/create', createRoomRequest)
roomRequestRoute.put('/:id/accept', RoomRequestAccept)
roomRequestRoute.put('/:id/reject', RoomRequestRejected)
roomRequestRoute.get('/', getRoomRequest)
roomRequestRoute.get('/request', getRoomRequestByKostId)

export default roomRequestRoute;