import mongoose from "mongoose";

export default interface Notification extends Document {
    message: string,
    receiver: mongoose.Types.ObjectId,
    read: boolean
}