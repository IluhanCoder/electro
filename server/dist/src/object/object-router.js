"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const object_controller_1 = __importDefault(require("./object-controller"));
const data_controller_1 = __importDefault(require("../data/data-controller"));
const objectRouter = (0, express_1.Router)();
objectRouter.post("/", object_controller_1.default.createObject);
objectRouter.get("/user", object_controller_1.default.getUserObjects);
objectRouter.get("/data/:objectId", data_controller_1.default.getObjectData);
objectRouter.delete("/:objectId", object_controller_1.default.deleteObjectById);
exports.default = objectRouter;
//# sourceMappingURL=object-router.js.map