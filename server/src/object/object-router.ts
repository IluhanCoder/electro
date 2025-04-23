import { Router } from "express";
import objectController from "./object-controller";
import dataController from "../data/data-controller";

const objectRouter = Router();

objectRouter.post("/", objectController.createObject);
objectRouter.get("/user", objectController.getUserObjects);
objectRouter.get("/data/:objectId", dataController.getObjectData);
objectRouter.delete("/:objectId", objectController.deleteObjectById);

export default objectRouter;