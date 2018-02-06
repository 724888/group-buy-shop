"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_dev_1 = require("../config/config.dev");
const commodity_model_1 = require("./commodity.model");
const mongoose = config_dev_1.settings.mongoose;
const Schema = mongoose.Schema;
const groupSchema = new Schema({
    commodityId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    communityId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    group_price: {
        type: Number,
        required: true
    },
    group_goal: {
        type: Number,
        required: true
    },
    group_attach: {
        type: Number,
        default: 0
    },
    group_time: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        default: 0
    },
    meta: {
        createdAt: {
            type: Date,
            default: Date.now()
        },
        updatedAt: {
            type: Date,
            default: Date.now()
        }
    }
});
groupSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.meta.createdAt = this.meta.updatedAt = Date.now();
        const c = yield commodity_model_1.Commodity.findOneAndUpdate({ _id: this.commodityId }, { status: 1, groupId: this._id }, { new: true });
        this.communityId = c.communityId;
        next();
    });
});
groupSchema.pre('findOneAndUpdate', function () {
    this.update({ "meta.updatedAt": Date.now() });
});
groupSchema.pre('update', function () {
    this.update({ "meta.updatedAt": Date.now() });
});
exports.Group = mongoose.model('Group', groupSchema);
//# sourceMappingURL=group.model.js.map