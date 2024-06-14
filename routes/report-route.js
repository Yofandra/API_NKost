import {Router} from "express";
import {createReport, updateReport, deleteReport} from "../controllers/report-controller.js";
import verifyToken from "../middlewares/authJwt.js";
import { Penyewa, statusAccess } from "../middlewares/accountChecker.js"; 

const reportRoute = Router();

reportRoute.use(verifyToken, statusAccess, Penyewa);

reportRoute.post("/create", createReport);
reportRoute.put("/update", updateReport);
reportRoute.delete("/delete", deleteReport);

export default reportRoute;