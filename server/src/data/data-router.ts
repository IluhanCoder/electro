import { Router } from "express";
import dataController from "./data-controller";

const dataRouter = Router();

dataRouter.post("/", dataController.createData);
dataRouter.get("/", dataController.fetchUserData);
dataRouter.get("/admin", dataController.fetchDataForAdmin);

dataRouter.get("/generate/:objectId", dataController.generateDataforUser);
dataRouter.get("/generate-instant/:objectId", dataController.generateInstantDataforUser);

dataRouter.post("/date-range", dataController.getDataByDateRange);
dataRouter.delete("/:dataId", dataController.deleteDataById);

export default dataRouter;