"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userHandleGenerater = userHandleGenerater;
exports.isLoggedIn = isLoggedIn;
const statusCodes_1 = __importDefault(require("./statusCodes"));
function userHandleGenerater(name) {
    let salt = "";
    for (let i = 0; i < 7; i++) {
        const it = Math.floor(Math.random() * 10);
        salt += it.toString();
    }
    return ` ${name}-${salt}`;
}
function isLoggedIn(req, res, next) {
    if (!req.user) {
        res.status(statusCodes_1.default.UNAUTHORIZED).json({
            success: false,
            message: "You are not logged in."
        });
    }
    else {
        next();
    }
}
;
