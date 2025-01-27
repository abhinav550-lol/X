"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
;
const mediaSchema = new mongoose_1.Schema({
    mediaAddress: {
        type: String,
        required: [true, 'Please provide a valid address for the media.']
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    tweetId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Tweet',
        required: true,
    },
    type: {
        type: String,
        enum: ['Video', 'Image'],
        required: [true, 'Please provide media type.']
    }
}, { timestamps: true });
mediaSchema.index({ userId: 1 });
mediaSchema.index({ tweetId: 1 });
exports.default = (0, mongoose_1.model)('Media', mediaSchema);
