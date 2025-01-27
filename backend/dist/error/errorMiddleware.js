"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = errorMiddleware;
function errorMiddleware(err, req, res, next) {
    let { name, message = "Internal Server Error", status = 500 } = err;
    if (name === "ValidationError") {
        message = "Mongoose Validation Failed";
        status = 400;
    }
    res.status(status).json({
        success: false,
        message,
    });
}
