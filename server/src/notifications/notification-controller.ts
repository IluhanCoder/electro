import { NextFunction, Request, Response } from "express";
import bindAll from "../helpers/bind-all";
import notificationService from "./notification-service";
import { AuthenticatedRequest } from "../auth/auth-types";

class NotificationController {
    async readNotification(req: Request, res: Response, next: NextFunction) {
        try {
            const {notificationId} = req.params;
            await notificationService.readNotification(notificationId);
            return res.status(200).json({message: "success"});
        } catch (error) {
            next(error);
        }
    }

    async fetchUserNotification(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const {user} = req;
            const notifications = await notificationService.fetchUserNotifications(user._id.toString());
            return res.status(200).json({notifications, message: "success"});
        } catch (error) {
            next(error);
        }
    }
}

const notificationController = new NotificationController();
bindAll(notificationController);
export default(notificationController);