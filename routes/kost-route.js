import { Router } from "express";
import { findAll, findOne, create, update, remove, checkPermission, findByIdUser } from "../controllers/kost-controller.js";
import verifyToken from "../middlewares/authJwt.js";
import {statusAccess, Pemilik} from "../middlewares/accountChecker.js";
const kostRoute = Router();

kostRoute.use(verifyToken, statusAccess);
kostRoute.get("/", findAll);
kostRoute.get("/id/:id", findOne);
kostRoute.get("/owner", findByIdUser);
kostRoute.post("/", Pemilik, create);
kostRoute.put("/:id", checkPermission, Pemilik, update);
kostRoute.delete("/:id",checkPermission, Pemilik, remove);

export default kostRoute;
