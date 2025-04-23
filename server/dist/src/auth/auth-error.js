"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customError_1 = require("../customError");
class AuthError extends customError_1.CustomError {
    constructor(type, message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.type = type;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
    static LoginPasswordNotMatches() {
        return new AuthError("password", "пароль та підтвердження пароля мають співпадати", 400);
    }
    static UserNotFound() {
        return new AuthError("user", "користувача не було знайдено", 400);
    }
    static InvalidPassword() {
        return new AuthError("password", "неправильний пароль", 400);
    }
    static DataExists(fieldName) {
        return new AuthError("data", `Поле "${fieldName}" з таким значенням вже існує.`, 400);
    }
    static VerificationFailed() {
        return new AuthError("data", `Помилка авторизації. Спробуйте зайти знову`, 401);
    }
}
exports.default = AuthError;
//# sourceMappingURL=auth-error.js.map