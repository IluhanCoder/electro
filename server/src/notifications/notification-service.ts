import mongoose from "mongoose";
import bindAll from "../helpers/bind-all";
import NotificationModel from "./notification-model";
import userService from "../user/user-service";
import { sendEmail } from "../../email/email-service";

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

    async createLimitExceededNotification(userId: string, objectId: string, consumedAmount: number, limit: number, tips?: string[]) {
        const message = `Споживання за поточну добу (${consumedAmount.toFixed(2)} кВт⋅г) перевищило встановлений ліміт (${limit.toFixed(2)} кВт⋅г).`;
        
        await NotificationModel.create({
            receiver: new mongoose.Types.ObjectId(userId),
            message
        });

        if(await userService.isSubmited(userId)) {
            const userEmail = await userService.getEmail(userId);
            sendEmail(userEmail, "перевищення лімітів споживання", `<div>${message}</div> </br>${tips ? tips.map(tip => {return `${tip}</br>`}) : ""}`);
          }
    }
    
}

const notificationService = new NotificationService();
bindAll(notificationService);
export default notificationService;