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
var _authService_instances, _authService_checkPasswordCredentials, _authService_assignToken, _authService_generateNewUser, _a;
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_service_1 = __importDefault(require("../user/user-service"));
const auth_error_1 = __importDefault(require("./auth-error"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.default = new (_a = class authService {
        constructor() {
            _authService_instances.add(this);
        }
        login(credentials) {
            return __awaiter(this, void 0, void 0, function* () {
                const candidate = yield user_service_1.default.findByNameOrEmail(credentials.nicknameOrEmail);
                if (!candidate)
                    throw auth_error_1.default.UserNotFound();
                const passwordIsValid = yield bcrypt_1.default.compare(credentials.password, candidate.password);
                if (!passwordIsValid)
                    throw auth_error_1.default.InvalidPassword();
                //pompiler cries if you don't do this
                const candidateId = candidate._id;
                const token = yield __classPrivateFieldGet(this, _authService_instances, "m", _authService_assignToken).call(this, candidateId);
                const response = { message: "success", user: candidate, token };
                return response;
            });
        }
        register(credentials) {
            return __awaiter(this, void 0, void 0, function* () {
                __classPrivateFieldGet(this, _authService_instances, "m", _authService_checkPasswordCredentials).call(this, credentials.password, credentials.passwordSubmit);
                const user = yield __classPrivateFieldGet(this, _authService_instances, "m", _authService_generateNewUser).call(this, credentials);
                const loginCredentials = { nicknameOrEmail: user.name, password: credentials.password };
                const token = (yield this.login(loginCredentials)).token;
                const response = { message: "success", user, token };
                return response;
            });
        }
        verify(token) {
            return __awaiter(this, void 0, void 0, function* () {
                const { userId } = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                if (!userId)
                    throw auth_error_1.default.VerificationFailed();
                const user = yield user_service_1.default.findById(userId);
                return user;
            });
        }
    },
    _authService_instances = new WeakSet(),
    _authService_checkPasswordCredentials = function _authService_checkPasswordCredentials(pswd1, pswd2) {
        if (pswd1 === pswd2)
            return true;
        throw auth_error_1.default.LoginPasswordNotMatches();
    },
    _authService_assignToken = function _authService_assignToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET);
        });
    },
    _authService_generateNewUser = function _authService_generateNewUser(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = yield bcrypt_1.default.genSalt(10);
            const hashedPassword = yield bcrypt_1.default.hash(credentials.password, salt);
            try {
                const user = yield user_service_1.default.createUser(Object.assign(Object.assign({}, credentials.userCredentials), { password: hashedPassword }));
                return user;
            }
            catch (error) {
                if (error.code === 11000) {
                    const duplicatedField = Object.keys(error.keyPattern)[0];
                    throw auth_error_1.default.DataExists(duplicatedField);
                }
                throw error;
            }
        });
    },
    _a);
//# sourceMappingURL=auth-service.js.map