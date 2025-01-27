"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        maxlength: [50, 'Name must not exceed 50 charecters.']
    },
    userHandle: {
        type: String,
        required: [true, 'User handle is required.'],
        unique: [true, 'Please enter a unique user handle.']
    },
    profilePic: {
        type: String,
    },
    following: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'User'
    },
    followers: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'User'
    },
    auth: {
        select: false,
        signInType: {
            type: String,
            enum: ["Google", "Session"]
        },
        sessionInfo: {
            password: {
                type: String,
                required: [function () {
                        return this.auth.signInType === "Session";
                    }, "Please enter a password."],
            }
        },
        googleInfo: {
            googleId: {
                type: String,
                required: [function () {
                        return this.auth.signInType === "Google";
                    }, "Please enter a google id."]
            }
        },
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('User', userSchema);
