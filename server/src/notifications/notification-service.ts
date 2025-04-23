import mongoose from "mongoose";
import bindAll from "../helpers/bind-all";
import NotificationModel from "./notification-model";

class NotificationService {
    async createNotification(receiver: mongoose.Types.ObjectId, message: string) {
        await NotificationModel.create({receiver, message});
    }

    async readNotification(notificationId: string) {
        await NotificationModel.findByIdAndUpdate(notificationId, {read: true});
    }

    async fetchUserNotifications(userId: string) {
        const convertedUserId = new mongoose.Types.ObjectId(userId);
        const notifications: Notification[] = await NotificationModel.find({receiver: convertedUserId});
        return notifications;
    }
}

const notificationService = new NotificationService();
bindAll(notificationService);
export default notificationService;