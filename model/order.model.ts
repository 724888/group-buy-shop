import {settings} from "../config/config.dev";

import * as M from 'mongoose';

import {IUser} from "./user.model";

import {Commodity, ICommodity} from "./commodity.model";

import {Group, IGroup} from "./group.model";

const mongoose = settings.mongoose;

const Schema = mongoose.Schema;

export interface IOrder extends M.Document {
    _id: string;
    userId: string | IUser;
    commodityId: string | ICommodity;
    spec: string;
    groupId: string | IGroup;
    out_trade_no: string;
    out_refund_no: string;
    transaction_id: string;
    quantity: number;
    payment: number;
    pick_code: string;
    pick_address: number;
    pick_time: string;
    is_notify: boolean;
    meta: { createdAt: string, updatedAt: string };
    status: number;
}

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
    payment:  Number, // 需付款的单位是分
    pick_code: String,
    pick_address: String,
    pick_time: String,
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
        /*
        此status用来描述订单的状态：
        0表示未支付/未收到微信方通知
        1表示订单已支付，正在拼团中
        2表示拼团达成，此时已生成取货码以及提货相关信息
        3表示拼团失败
        4表示正在退款
         */
    },
    is_pickup: {
        type: Boolean,
        default: false
    }
});

orderSchema.pre('save', async function (next) {
    this.meta.createdAt = this.meta.updatedAt = Date.now();
    const o = await Commodity.findOne({_id: this.commodityId})
        .populate('groupId');
    this.groupId = (o.groupId as IGroup)._id;
    this.payment = (o.groupId as IGroup).group_price * this.quantity * 100;
    next();
});

orderSchema.pre('findOneAndUpdate', function () {
    this.update({"meta.updatedAt": Date.now()})
});

orderSchema.pre('update', function () {
    this.update({"meta.updatedAt": Date.now()})
});

export const Order = mongoose.model<IOrder>('Order', orderSchema);