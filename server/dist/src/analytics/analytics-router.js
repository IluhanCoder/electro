"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analytics_controller_1 = __importDefault(require("./analytics-controller"));
const analyticsRouter = (0, express_1.Router)();
analyticsRouter.post("/amount", analytics_controller_1.default.caclulateAmount);
analyticsRouter.post("/average", analytics_controller_1.default.caclulateMonthAverage);
exports.default = analyticsRouter;
//# sourceMappingURL=analytics-router.js.map