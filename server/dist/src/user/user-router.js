"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_service_1 = __importDefault(require("./user-service"));
const userRouter = (0, express_1.Router)();
userRouter.get("/isAdmin/:userId", user_service_1.default.isAdmin);
exports.default = userRouter;
//# sourceMappingURL=user-router.js.map