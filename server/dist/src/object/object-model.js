"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsumptionType = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var ConsumptionType;
(function (ConsumptionType) {
    ConsumptionType["HOUSE"] = "house";
    ConsumptionType["APARTAMENT"] = "apartament";
    ConsumptionType["OFFICE"] = "office";
    ConsumptionType["ENTERPRISE"] = "enterprise";
})(ConsumptionType || (exports.ConsumptionType = ConsumptionType = {}));
const objectModel = new mongoose_1.default.Schema({
    owner: { type: mongoose_1.default.Types.ObjectId, ref: "User" },
    type: {
        type: String,
        enum: Object.values(ConsumptionType),
        required: false
    },
    name: String,
    limit: { type: Number, required: false },
}, {
    timestamps: true
});
const ObjectModel = mongoose_1.default.model('Object', objectModel);
exports.default = ObjectModel;
//# sourceMappingURL=object-model.js.map