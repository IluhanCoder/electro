"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const customError_1 = require("./customError");
function errorHandler(err, req, res, next) {
    if (err instanceof customError_1.CustomError) {
        res.status(err.statusCode).json({
            message: err.message
        });
        return;
    }
    console.error("Unhandled error:", err);
    res.status(500).json({
        message: "Internal server error"
    });
}
//# sourceMappingURL=error-handler.js.map