import { useEffect, useState } from "react";
import notificationService from "./notification-service";
import serviceErrorHandler from "../service-error-handler";
import { toast } from "react-toastify";

export interface Notification {
    _id: string;
    message: string;
    receiver: string;
    read: boolean;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>();

    const markAsReadIfNeeded = async (notification: Notification) => {
        if (!notification.read) {
            try {
                await notificationService.readNotification(notification._id);
                // не оновлюємо локальний стан — щоб лишалося "жовтим"
            } catch (error) {
                console.warn("Помилка при позначенні як прочитане:", error);
            }
        }
    };

    const getData = async () => {
        try {
            const result = await notificationService.fetchUserNotifications();
            setNotifications([...result.notifications]);

            // позначити всі непрочитані як прочитані (на сервері)
            result.notifications.forEach((notif) => {
                if (!notif.read) markAsReadIfNeeded(notif);
            });
        } catch (error) {
            const handled = serviceErrorHandler(error);
            if (!handled) {
                toast.error("щось пішло не так...");
                console.log(error);
            }
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="w-full min-h-screen p-8 bg-gray-50">
            <h1 className="text-2xl font-bold mb-6 text-center">Сповіщення</h1>
            <div className="flex flex-col gap-4 max-w-3xl mx-auto">
                {notifications?.length === 0 && (
                    <div className="text-center text-gray-500">Немає сповіщень</div>
                )}
                {notifications?.map((notification) => (
                    <div
                        key={notification._id}
                        className={`p-4 rounded-xl border shadow-sm transition-all ${
                            notification.read
                                ? "bg-white border-gray-200"
                                : "bg-yellow-50 border-yellow-400"
                        }`}
                    >
                        <div className="text-sm text-gray-600">ID: {notification._id}</div>
                        <div className="text-md font-medium text-gray-800 mt-1">
                            {notification.message}
                        </div>
                        {!notification.read && (
                            <div className="text-xs text-yellow-700 mt-2">Нове повідомлення</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
