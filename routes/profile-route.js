import { Router } from "express";
import { findAll, getUserById, deleteUser, updateUser, updateUserById, findOne } from "../controllers/profile-controller.js";
import verifyToken from "../middlewares/authJwt.js";
import {statusAccess, checkPermission, adminPermission} from "../middlewares/accountChecker.js";
const profileRoute = Router();

profileRoute.get("/", findAll);
profileRoute.get("/id/:id", verifyToken, statusAccess, findOne);
profileRoute.get("/user", verifyToken, getUserById);
profileRoute.put('/update', verifyToken, statusAccess, updateUser);
profileRoute.put('/update/:id', verifyToken, statusAccess, adminPermission, updateUserById);
profileRoute.delete("/:id", verifyToken, statusAccess, deleteUser);

export default profileRoute;