"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_controller_1 = __importDefault(require("./data-controller"));
const dataRouter = (0, express_1.Router)();
dataRouter.post("/", data_controller_1.default.createData);
dataRouter.get("/", data_controller_1.default.fetchUserData);
dataRouter.get("/admin", data_controller_1.default.fetchDataForAdmin);
dataRouter.get("/generate/:objectId", data_controller_1.default.generateDataforUser);
dataRouter.get("/generate-instant/:objectId", data_controller_1.default.generateInstantDataforUser);
dataRouter.post("/date-range", data_controller_1.default.getDataByDateRange);
dataRouter.delete("/:dataId", data_controller_1.default.deleteDataById);
exports.default = dataRouter;
//# sourceMappingURL=data-router.js.map