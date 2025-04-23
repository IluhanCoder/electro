import mongoose from "mongoose";

const dataModel = new mongoose.Schema({
    message: String,
    receiver: {type: mongoose.Types.ObjectId, ref: "User"},
    read: {type: Boolean, default: false}
}, {timestamps: true});
  
const NotificationModel = mongoose.model('Notification', dataModel);
  
export default NotificationModel;