"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const counterModel = new mongoose_1.default.Schema({
    ip: String,
    user: { type: mongoose_1.default.Types.ObjectId, ref: "User" },
    object: { type: mongoose_1.default.Types.ObjectId, ref: "Object" }
}, { timestamps: true });
const CounterModel = mongoose_1.default.model('Counter', counterModel);
exports.default = CounterModel;
//# sourceMappingURL=counter-model.js.map