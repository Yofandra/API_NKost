import { Router } from "express";
import { findAll, getUserById, deleteUser, updateUser } from "../controllers/profile-controller.js";
import verifyToken from "../middlewares/authJwt.js";
import {statusAccess, checkPermission, adminPermission} from "../middlewares/accountChecker.js";
import authJwt from "../middlewares/authJwt.js";
const profileRoute = Router();

profileRoute.use(authJwt);
profileRoute.get("/", verifyToken, statusAccess, adminPermission, findAll);
profileRoute.get("/:id", verifyToken, statusAccess, checkPermission, getUserById);
profileRoute.put('/:id', verifyToken, statusAccess, checkPermission, updateUser);
profileRoute.delete("/:id", verifyToken, statusAccess, checkPermission, deleteUser);

export default profileRoute;