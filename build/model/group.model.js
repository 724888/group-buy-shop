"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_dev_1 = require("../config/config.dev");
const mongoose = config_dev_1.settings.mongoose;
const Schema = mongoose.Schema;
const groupSchema = new Schema({
    commodityId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Commodity'
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
    this.meta.createdAt = this.meta.updatedAt = Date.now();
    next();
});
groupSchema.pre('findOneAndUpdate', function () {
    this.update({ "meta.updatedAt": Date.now() });
});
groupSchema.pre('update', function () {
    this.update({ "meta.updatedAt": Date.now() });
});
exports.Group = mongoose.model('Group', groupSchema);
//# sourceMappingURL=group.model.js.map