import {settings} from '../config/config.dev';

import * as M from 'mongoose';

import {Commodity, ICommodity} from "./commodity.model";

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

groupSchema.pre('save', async function (next) {
    this.meta.createdAt = this.meta.updatedAt = Date.now();
    const c = await Commodity.findOneAndUpdate({_id: this.commodityId}, {status: 1, groupId: this._id}, {new: true});
    this.communityId = c.communityId;
    next();
});

groupSchema.pre('findOneAndUpdate', function () {
    this.update({"meta.updatedAt": Date.now()})
});

groupSchema.pre('update', function () {
    this.update({"meta.updatedAt": Date.now()})
});

export const Group = mongoose.model<IGroup>('Group', groupSchema);