"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const user_types_1 = require("./user-types");
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        unique: false,
    },
    surname: {
        type: String,
        required: true,
        unique: false,
    },
    nickname: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: false,
    },
    role: {
        type: String,
        enum: Object.values(user_types_1.Roles)
    }
});
const UserModel = mongoose_1.default.model('User', userSchema);
exports.default = UserModel;
//# sourceMappingURL=user-model.js.map