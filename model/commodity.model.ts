import {settings} from "../config/config.dev";

import * as M from 'mongoose';
import {IGroup} from "./group.model";

const mongoose = settings.mongoose;

const Schema = mongoose.Schema;

export interface ICommodity extends M.Document {
    _id: string;
    bannerIds: Array<string>;
    communityId: string;
    categoryId: string;
    price: number;
    specs: Array<string>;
    stock: number;
    content: string;
    parameter: any;
    status: number;
    groupId: string | IGroup;
    is_hot: boolean;
    is_commend: boolean;
    meta: { createdAt: string, updatedAt: string };
}

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
    next()

});

commoditySchema.pre('findOneAndUpdate', function () {
    this.update({"meta.updatedAt": Date.now()})
});

commoditySchema.pre('update', function () {
    this.update({"meta.updatedAt": Date.now()})
});


export const Commodity = mongoose.model<ICommodity>('Commodity', commoditySchema);
