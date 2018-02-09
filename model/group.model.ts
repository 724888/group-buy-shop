import {settings} from '../config/config.dev';

import * as M from 'mongoose';

import {ICommodity} from "./commodity.model";

const mongoose = settings.mongoose;

const Schema = mongoose.Schema;

export interface IGroup extends M.Document {
    _id: string;
    commodityId: string | ICommodity;
    communityId: string;
    group_price: number;
    group_goal: number;
    group_attach: number;
    group_time: number;
    status: number;
    meta: { createdAt: string, updatedAt: string };
}

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
        /*
        status：0表示拼团进行中
                1表示拼团达成
                2表示拼团失败
         */
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
    this.update({"meta.updatedAt": Date.now()})
});

groupSchema.pre('update', function () {
    this.update({"meta.updatedAt": Date.now()})
});

export const Group = mongoose.model<IGroup>('Group', groupSchema);