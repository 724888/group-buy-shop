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
    bannerIds: [Schema.Types.ObjectId],
    communityId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        required: true
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
    groupId: Schema.Types.ObjectId,
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
    if (this.isNew) {
        this.meta.createdAt = this.meta.updatedAt = Date.now();
    }
    else {
        this.meta.updatedAt = Date.now();
    }
    next();
});
exports.Commodity = mongoose.model('Commodity', commoditySchema);
//# sourceMappingURL=commodity.model.js.map