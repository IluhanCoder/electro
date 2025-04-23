"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customError_1 = require("../customError");
class ObjectError extends customError_1.CustomError {
    constructor(type, message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.type = type;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
    static ObjectExists() {
        return new ObjectError("name", "обʼєкт з такою назвою вже додано", 400);
    }
}
exports.default = ObjectError;
//# sourceMappingURL=object-error.js.map