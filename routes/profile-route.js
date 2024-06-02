import { Router } from "express";
import { findAll, getUserById, deleteUser, updateUser } from "../controllers/profile-controller.js";
import verifyToken from "../middlewares/authJwt.js";
import statusAccess from "../middlewares/statusAccess.js";
const profileRoute = Router();

profileRoute.get("/", verifyToken, statusAccess, findAll);
profileRoute.get("/:id", verifyToken, statusAccess, getUserById);
profileRoute.put('/:id', verifyToken, statusAccess, updateUser);
profileRoute.delete("/:id", verifyToken, statusAccess, deleteUser);

export default profileRoute;