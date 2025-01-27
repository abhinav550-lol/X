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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoConnection_1 = require("./config/mongoConnection");
const errorMiddleware_1 = __importDefault(require("./error/errorMiddleware"));
const express_session_1 = __importDefault(require("express-session"));
require("./config/passport");
const tagClear_1 = __importDefault(require("./tasks/tagClear"));
//Config & Jobs
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
}));
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
tagClear_1.default.start();
//Routes
//Error Middleware
app.use(errorMiddleware_1.default);
//Server Start
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("MONGO_URI is not defined in the .env file");
        }
        yield (0, mongoConnection_1.connectDB)(mongoUri);
        app.listen(3000, () => { console.log("Server online!"); });
    }
    catch (error) {
        console.error("Error starting the server:", error);
        process.exit(1);
    }
});
startServer();
