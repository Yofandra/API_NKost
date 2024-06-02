import { Router } from "express";
import { findAll, findOne, create, update, remove } from "../controllers/kost-controller.js";
import authJwt from "../middlewares/authJwt.js";
const kostRoute = Router();

kostRoute.use(authJwt);
kostRoute.get("/", findAll);
kostRoute.get("/:id", findOne);
kostRoute.post("/", create);
kostRoute.put("/:id", update);
kostRoute.delete("/:id", remove);

export default kostRoute;
