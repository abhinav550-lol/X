"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../error/AppError"));
const statusCodes_1 = __importDefault(require("../utils/statusCodes"));
const tweetSchema = new mongoose_1.Schema({
    postedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "The user who posted the tweet must be specified."]
    },
    text: {
        type: String,
    },
    media: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'Media',
        default: [],
    },
    comments: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'Comment',
        default: [],
    },
    likedBy: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'User',
        default: [],
    },
    tweetType: {
        type: String,
        enum: ['Tweet', 'Retweet'],
        required: [true, "Please provide the tweet type. "],
    },
    retweetId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Tweet',
        required: [function () {
                return this.tweetType === 'Retweet';
            }, "Please provide the tweet id to retweet."]
    }
}, { timestamps: true });
tweetSchema.pre('validate', function (next) {
    if (!this.text && (this.media && this.media.length === 0)) {
        return next(new AppError_1.default(statusCodes_1.default.BAD_REQUEST, "Please provide content for the tweet."));
    }
    if (this.tweetType === 'Retweet' && !this.retweetId) {
        return next(new AppError_1.default(statusCodes_1.default.BAD_REQUEST, "Please provide with the retweet id."));
    }
    next();
});
exports.default = (0, mongoose_1.model)('Tweet', tweetSchema);
