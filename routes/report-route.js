import {Router} from "express";
import {createReport, updateReport, deleteReport, getReportByIdUser, getReportByIdRoom} from "../controllers/report-controller.js";
import verifyToken from "../middlewares/authJwt.js";
import { Penyewa, statusAccess } from "../middlewares/accountChecker.js"; 

const reportRoute = Router();

reportRoute.use(verifyToken, statusAccess);

reportRoute.get("/allReport", getReportByIdRoom);
reportRoute.get("/user", getReportByIdUser);
reportRoute.post("/", Penyewa, createReport);
reportRoute.put("/:id", Penyewa, updateReport);
reportRoute.delete("/:id", Penyewa, deleteReport);

export default reportRoute;