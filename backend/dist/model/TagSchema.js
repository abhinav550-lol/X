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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
;
const tagSchema = new mongoose_1.Schema({
    keyword: {
        type: String,
        required: [true, "A hash keyword is required."],
    },
    frequency: {
        type: Number,
        default: 1
    }
});
tagSchema.statics.createOrUpdateTag = function (key) {
    return __awaiter(this, void 0, void 0, function* () {
        const foundTag = yield this.findOne({ keyword: key });
        if (!foundTag) {
            yield this.create({ keyword: key });
        }
        else {
            foundTag.frequency++;
            yield foundTag.save();
        }
    });
};
exports.default = (0, mongoose_1.model)('Tag', tagSchema);
