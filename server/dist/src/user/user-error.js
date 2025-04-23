"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customError_1 = require("../customError");
class UserError extends customError_1.CustomError {
    constructor(type, message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.type = type;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
    static WrongRole() {
        return new UserError("data", `Користувачеві відмовлено в доступі`, 400);
    }
}
exports.default = UserError;
//# sourceMappingURL=user-error.js.map