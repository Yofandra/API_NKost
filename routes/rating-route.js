import { Router } from "express";
import { findAll, findByIdUser, findByIdKost, create, update, destroy } from "../controllers/rating-controller.js";
import verifyToken from "../middlewares/authJwt.js";
import {statusAccess, Penyewa} from "../middlewares/accountChecker.js";
const ratingRoute = Router()

ratingRoute.use(verifyToken, statusAccess)
ratingRoute.get("/", findAll)
ratingRoute.get("/:id", findByIdKost)
ratingRoute.get("/user", findByIdUser)
ratingRoute.post("/", Penyewa, create)
ratingRoute.put("/user", Penyewa, update)
ratingRoute.delete("/user", Penyewa, destroy)

export default ratingRoute