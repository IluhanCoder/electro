"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dataModel = new mongoose_1.default.Schema({
    message: String,
    receiver: { type: mongoose_1.default.Types.ObjectId, ref: "User" },
    read: { type: Boolean, default: false }
}, { timestamps: true });
const NotificationModel = mongoose_1.default.model('Notification', dataModel);
exports.default = NotificationModel;
//# sourceMappingURL=notification-model.js.map