"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
;
const commentSchema = new mongoose_1.Schema({
    tweetId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Tweet',
        required: [true, "Please give the tweet id to add comment."],
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Please enter the user id."]
    },
    repliedTo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Please enter the user id that is being replied to."]
    },
    likes: {
        type: Number,
        default: 0,
    },
    text: {
        type: String,
        required: [true, "Please enter the comment text."],
        max: [300, "The comment must not exceed 300 charecters."]
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Comment', commentSchema);
