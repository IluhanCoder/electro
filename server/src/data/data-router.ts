import { Router } from "express";
import dataController from "./data-controller";
import { getAllCountersForService } from "./get-counters";

const dataRouter = Router();

dataRouter.post("/", dataController.createData);
dataRouter.get("/", dataController.fetchUserData);
dataRouter.get("/admin", dataController.fetchDataForAdmin);

dataRouter.post("/generate/:objectId", dataController.generateDataforUser);
dataRouter.get("/generate-instant/:objectId", dataController.generateInstantDataforUser);

dataRouter.post("/date-range", dataController.getDataByDateRange);
dataRouter.delete("/:dataId", dataController.deleteDataById);

dataRouter.get("/counters", getAllCountersForService);

export default dataRouter;