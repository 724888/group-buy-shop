"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_dev_1 = require("../config/config.dev");
const mongoose = config_dev_1.settings.mongoose;
const Schema = mongoose.Schema;
const commoditySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    bannerIds: [{
            type: Schema.Types.ObjectId,
            ref: 'Banner'
        }],
    communityId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Community'
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    },
    price: Number,
    specs: [String],
    stock: Number,
    content: String,
    parameter: Schema.Types.Mixed,
    status: {
        type: Number,
        default: 0
    },
    groupId: {
        type: Schema.Types.ObjectId,
        ref: 'Group'
    },
    is_hot: {
        type: Boolean,
        default: false
    },
    is_commend: {
        type: Boolean,
        default: false
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
commoditySchema.pre('save', function (next) {
    this.meta.createdAt = this.meta.updatedAt = Date.now();
    next();
});
commoditySchema.pre('findOneAndUpdate', function () {
    this.update({ "meta.updatedAt": Date.now() });
});
commoditySchema.pre('update', function () {
    this.update({ "meta.updatedAt": Date.now() });
});
exports.Commodity = mongoose.model('Commodity', commoditySchema);
//# sourceMappingURL=commodity.model.js.map