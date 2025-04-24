import $api from "../axios"
import Notification from "./notifications-types";

export default new class NotificationRouter {
    async readNotification(notificationId: string) {
        return ((await ($api.patch(`/notification/read/${notificationId}`))).data);
    }

    async fetchUserNotifications() {
        return ((await ($api.get("/notification"))).data) as {notifications: Notification[], message: string};
    }
}