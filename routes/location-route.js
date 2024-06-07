import { Router } from "express";
import { findAll, findOne, create } from "../controllers/location-controller.js";
import verifyToken from "../middlewares/authJwt.js";
import {statusAccess} from "../middlewares/accountChecker.js";
const locationRoute = Router();

locationRoute.use(verifyToken, statusAccess);
locationRoute.get("/", findAll);
locationRoute.get("/:id", findOne);
locationRoute.post("/", create);

export default locationRoute;

