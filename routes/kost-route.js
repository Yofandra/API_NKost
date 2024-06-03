import { Router } from "express";
import { findAll, findOne, create, update, remove, checkPermission, findByIdUser } from "../controllers/kost-controller.js";
import verifyToken from "../middlewares/authJwt.js";
import {statusAccess} from "../middlewares/accountChecker.js";
const kostRoute = Router();

kostRoute.use(verifyToken, statusAccess);
kostRoute.get("/", findAll);
kostRoute.get("/from/:id", findOne);
kostRoute.get("/owner", findByIdUser);
kostRoute.post("/", create);
kostRoute.put("/:id", checkPermission, update);
kostRoute.delete("/:id",checkPermission, remove);

export default kostRoute;
