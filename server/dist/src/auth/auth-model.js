"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const auth_types_1 = require("./auth-types");
const authSchema = new mongoose_1.default.Schema({
    userId: mongoose_1.default.Types.ObjectId,
    token: String,
    status: {
        type: String,
        enum: Object.values(auth_types_1.AuthStatus)
    }
}, { timestamps: true });
const AuthModel = mongoose_1.default.model('Auth', authSchema);
exports.default = AuthModel;
//# sourceMappingURL=auth-model.js.map