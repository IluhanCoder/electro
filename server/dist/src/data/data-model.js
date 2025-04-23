"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const data_types_1 = require("./data-types");
const dataModel = new mongoose_1.default.Schema({
    object: { type: mongoose_1.default.Types.ObjectId, ref: "Object" },
    user: { type: mongoose_1.default.Types.ObjectId, ref: "User" },
    amount: Number,
    category: {
        type: String,
        enum: Object.values(data_types_1.ConsumptionCategory),
        required: false
    },
    comment: {
        type: String,
        required: false
    },
    date: Date
});
const DataModel = mongoose_1.default.model('Data', dataModel);
exports.default = DataModel;
//# sourceMappingURL=data-model.js.map