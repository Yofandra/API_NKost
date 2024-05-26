import { Router } from "express";
import { findAll, findOne, update } from "../controllers/profile-controller.js";
const profileRoute = Router();

profileRoute.get("/", findAll);
profileRoute.get("/:id", findOne);
profileRoute.put("/:id", update);

export default profileRoute;