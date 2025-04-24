"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("./user-controller"));
const userRouter = (0, express_1.Router)();
userRouter.get("/isAdmin/:userId", user_controller_1.default.isAdmin);
userRouter.get("/confirm-email/:id", user_controller_1.default.confirmEmail);
userRouter.post("/send-confirmation", user_controller_1.default.sendConfirmation);
exports.default = userRouter;
//# sourceMappingURL=user-router.js.map