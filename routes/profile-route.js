import { Router } from "express";
import { findAll, getUserById, deleteUser, updateUser, updateUserById } from "../controllers/profile-controller.js";
import verifyToken from "../middlewares/authJwt.js";
import {statusAccess, checkPermission, adminPermission} from "../middlewares/accountChecker.js";
const profileRoute = Router();

profileRoute.get("/", findAll);
profileRoute.get("/:id", getUserById);
profileRoute.put('/update', verifyToken, statusAccess, checkPermission, updateUser);
profileRoute.put('/update/:id', verifyToken, statusAccess, adminPermission, updateUserById);
profileRoute.delete("/:id", verifyToken, statusAccess, checkPermission, deleteUser);

export default profileRoute;