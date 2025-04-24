export default interface Notification {
    _id: string,
    message: string,
    receiver: string,
    read: boolean
}

export type NotificationResponse = Omit<Notification, "_id">;