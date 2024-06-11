import { Router } from "express";
import { findAll, findOne, create, update, destroy, findByIdKost, checkPermission, checkPermissionCreate } from "../controllers/location-controller.js";
import verifyToken from "../middlewares/authJwt.js";
import {statusAccess} from "../middlewares/accountChecker.js";
const locationRoute = Router();

locationRoute.use(verifyToken, statusAccess);
locationRoute.get("/", findAll);
locationRoute.get("/id/:id", findOne);
locationRoute.get("/kost/:id", findByIdKost);
locationRoute.post("/",checkPermissionCreate, create);
locationRoute.put("/:id",checkPermission, update);
locationRoute.delete("/:id",checkPermission, destroy);

export default locationRoute;

