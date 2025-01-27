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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth2_1 = __importDefault(require("passport-google-oauth2"));
const UserSchema_1 = __importDefault(require("../model/UserSchema"));
const utils_1 = require("../utils/utils");
const GoogleStrategy = passport_google_oauth2_1.default.Strategy;
passport_1.default.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.FRONTEND_URI}/home`,
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield UserSchema_1.default.findOne({ "googleInfo.googleId": profile.id });
        if (!user) {
            let userHandle = "";
            let found = true;
            while (found) {
                userHandle = (0, utils_1.userHandleGenerater)(profile.name.givenName);
                let existingUser = yield UserSchema_1.default.findOne({ userHandle });
                if (existingUser) {
                    found = true;
                }
                else {
                    found = false;
                }
            }
            const newUser = {
                name: profile.displayName,
                userHandle: userHandle,
                auth: {
                    signInType: "Google",
                    googleInfo: {
                        googleId: profile.id
                    },
                }
            };
            user = yield UserSchema_1.default.create(newUser);
        }
        return done(null, user);
    }
    catch (e) {
        return done(e, null);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserSchema_1.default.findById(id);
        return done(null, user);
    }
    catch (e) {
        return done(e, null);
    }
}));
