import {Router} from 'express'
import {createRoomRequest, RoomRequestAccept, RoomRequestRejected, getRoomRequest} from '../controllers/roomRequest-controller.js'
import {statusAccess, checkPermission, adminPermission} from "../middlewares/accountChecker.js";

const roomRequestRoute = Router()

roomRequestRoute.post('/', createRoomRequest)
roomRequestRoute.put('/accept', RoomRequestAccept)
roomRequestRoute.put('/reject', RoomRequestRejected)
roomRequestRoute.get('/', getRoomRequest)


export default roomRequestRoute;