import { Router } from "express";
import notificationController from "./notification-controller";

const notificationRouter = Router();

notificationRouter.patch("/read/:notificationId", notificationController.readNotification);
notificationRouter.get("/", notificationController.fetchUserNotification);

export default notificationRouter;