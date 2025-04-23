"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = __importDefault(require("./notification-controller"));
const notificationRouter = (0, express_1.Router)();
notificationRouter.patch("/read/:notificationId", notification_controller_1.default.readNotification);
notificationRouter.get("/", notification_controller_1.default.fetchUserNotification);
exports.default = notificationRouter;
//# sourceMappingURL=notification-router.js.map