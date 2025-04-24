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
const user_service_1 = __importDefault(require("./user-service"));
const user_model_1 = __importDefault(require("./user-model"));
exports.default = new class UserController {
    isAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const isAdmin = yield user_service_1.default.isAdmin(userId);
                return res.status(200).json({ isAdmin, message: "success" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    sendConfirmation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user._id;
                yield user_service_1.default.sendConfirmationEmail(userId.toString());
                res.status(200).json({ message: "Email sent" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    confirmEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                console.log(id);
                yield user_model_1.default.findByIdAndUpdate(id, { emailSubmited: true });
                res.send("Email підтверджено. Тепер ви можете отримувати листи.");
            }
            catch (error) {
                next(error);
            }
        });
    }
};
//# sourceMappingURL=user-controller.js.map