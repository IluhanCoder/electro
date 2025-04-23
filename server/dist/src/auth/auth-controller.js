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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _AuthController_instances, _AuthController_verifyAuthHeader;
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const auth_error_1 = __importDefault(require("./auth-error"));
const auth_service_1 = __importDefault(require("./auth-service"));
const bind_all_1 = __importDefault(require("../helpers/bind-all"));
class AuthController {
    constructor() {
        _AuthController_instances.add(this);
    }
    authMiddleware(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { authorization } = req.headers;
            try {
                const user = yield __classPrivateFieldGet(this, _AuthController_instances, "m", _AuthController_verifyAuthHeader).call(this, authorization);
                req.user = user;
                next();
            }
            catch (error) {
                if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
                    console.log(error);
                    error = auth_error_1.default.VerificationFailed();
                }
                next(error);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { credentials } = req.body;
                const response = yield auth_service_1.default.login(credentials);
                return res.status(200).json(Object.assign(Object.assign({}, response), { message: "success" }));
            }
            catch (error) {
                next(error);
            }
        });
    }
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { credentials } = req.body;
                const response = yield auth_service_1.default.register(credentials);
                return res.status(200).json(Object.assign(Object.assign({}, response), { message: "success" }));
            }
            catch (error) {
                next(error);
            }
        });
    }
    verify(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { authorization } = req.headers;
            try {
                const user = yield __classPrivateFieldGet(this, _AuthController_instances, "m", _AuthController_verifyAuthHeader).call(this, authorization);
                const response = { user };
                return res.status(200).json(Object.assign(Object.assign({}, response), { message: "success" }));
            }
            catch (error) {
                if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
                    console.log(error);
                    error = auth_error_1.default.VerificationFailed();
                }
                next(error);
            }
        });
    }
}
_AuthController_instances = new WeakSet(), _AuthController_verifyAuthHeader = function _AuthController_verifyAuthHeader(authorization) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!authorization) {
            throw auth_error_1.default.VerificationFailed();
        }
        const token = authorization.split(' ')[1];
        const user = yield auth_service_1.default.verify(token);
        if (!user) {
            throw auth_error_1.default.VerificationFailed();
        }
        return user;
    });
};
//todo: зробити так для всіх
const authController = new AuthController();
(0, bind_all_1.default)(authController);
exports.default = authController;
//# sourceMappingURL=auth-controller.js.map