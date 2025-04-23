"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("./user-model"));
const user_types_1 = require("./user-types");
exports.default = new class UserService {
    createUser(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.create(Object.assign(Object.assign({}, credentials), { role: user_types_1.Roles.USER }));
        });
    }
    findByNameOrEmail(nameOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.findOne({ $or: [{ nickname: nameOrEmail }, { email: nameOrEmail }] });
        });
    }
    findById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.findById(userId);
        });
    }
    isAdmin(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findById(userId);
            return user.role === "admin";
        });
    }
};
//# sourceMappingURL=user-service.js.map