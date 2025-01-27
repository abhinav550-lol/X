"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
;
const notificationSchema = new mongoose_1.Schema({
    senderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide the sender id."]
    },
    receiverId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide the reciever id."]
    },
    for: {
        type: String,
        required: true,
        enum: ['liked', 'retweeted', 'commented', 'posted']
    },
    targetLink: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Tweet",
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
notificationSchema.index({ receiverId: 1, isRead: 1 });
exports.default = (0, mongoose_1.model)('Notification', notificationSchema);
