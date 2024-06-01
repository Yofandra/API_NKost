import { Router } from "express";
import { findAll, getUserById, deleteUser, updateUser } from "../controllers/profile-controller.js";
import verifyToken from "../middlewares/authJwt.js";
const profileRoute = Router();

profileRoute.get("/", verifyToken, findAll);
profileRoute.get("/:id", verifyToken, getUserById);
profileRoute.put('/:id', verifyToken, updateUser);
profileRoute.delete("/:id", verifyToken, deleteUser);

export default profileRoute;