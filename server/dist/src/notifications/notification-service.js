"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bind_all_1 = __importDefault(require("../helpers/bind-all"));
const notification_model_1 = __importDefault(require("./notification-model"));
const user_service_1 = __importDefault(require("../user/user-service"));
const email_service_1 = require("../email/email-service");
class NotificationService {
    createNotification(receiver, message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield notification_model_1.default.create({ receiver, message });
        });
    }
    readNotification(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield notification_model_1.default.findByIdAndUpdate(notificationId, { read: true });
        });
    }
    fetchUserNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const convertedUserId = new mongoose_1.default.Types.ObjectId(userId);
            const notifications = yield notification_model_1.default.find({ receiver: convertedUserId });
            return notifications;
        });
    }
    createLimitExceededNotification(userId, objectId, consumedAmount, limit, tips) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = `Споживання за поточну добу (${consumedAmount.toFixed(2)} кВт⋅г) перевищило встановлений ліміт (${limit.toFixed(2)} кВт⋅г).`;
            yield notification_model_1.default.create({
                receiver: new mongoose_1.default.Types.ObjectId(userId),
                message
            });
            if (yield user_service_1.default.isSubmited(userId)) {
                const userEmail = yield user_service_1.default.getEmail(userId);
                (0, email_service_1.sendEmail)(userEmail, "перевищення лімітів споживання", `<div>${message}</div> </br>${tips ? tips.map(tip => { return `${tip}</br>`; }) : ""}`);
            }
        });
    }
}
const notificationService = new NotificationService();
(0, bind_all_1.default)(notificationService);
exports.default = notificationService;
//# sourceMappingURL=notification-service.js.map