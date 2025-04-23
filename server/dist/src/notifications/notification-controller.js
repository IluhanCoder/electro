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
const bind_all_1 = __importDefault(require("../helpers/bind-all"));
const notification_service_1 = __importDefault(require("./notification-service"));
class NotificationController {
    readNotification(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { notificationId } = req.params;
                yield notification_service_1.default.readNotification(notificationId);
                return res.status(200).json({ message: "success" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    fetchUserNotification(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = req;
                const notifications = yield notification_service_1.default.fetchUserNotifications(user._id.toString());
                return res.status(200).json({ notifications, message: "success" });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
const notificationController = new NotificationController();
(0, bind_all_1.default)(notificationController);
exports.default = (notificationController);
//# sourceMappingURL=notification-controller.js.map