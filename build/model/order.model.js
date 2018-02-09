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
const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    commodityId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Commodity'
    },
    spec: String,
    groupId: {
        type: Schema.Types.ObjectId,
        ref: 'Group'
    },
    out_trade_no: {
        type: String,
        required: true
    },
    out_refund_no: String,
    transaction_id: String,
    quantity: {
        type: Number,
        required: true
    },
    payment: Number,
    pick_code: String,
    pick_address: String,
    pick_time: Date,
    is_notify: {
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
    },
    status: {
        type: Number,
        default: 0
    },
});
orderSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.meta.createdAt = this.meta.updatedAt = Date.now();
        const o = yield commodity_model_1.Commodity.findOne({ _id: this.commodityId })
            .populate('groupId');
        this.groupId = o.groupId._id;
        this.payment = o.groupId.group_price * this.quantity * 100;
        next();
    });
});
orderSchema.pre('findOneAndUpdate', function () {
    this.update({ "meta.updatedAt": Date.now() });
});
orderSchema.pre('update', function () {
    this.update({ "meta.updatedAt": Date.now() });
});
exports.Order = mongoose.model('Order', orderSchema);
//# sourceMappingURL=order.model.js.map