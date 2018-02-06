import {settings} from '../config/config.dev';

import * as M from 'mongoose';

const mongoose = settings.mongoose;

const Schema = mongoose.Schema;

export interface ICommunity extends M.Document {
    _id: string;
    name: string;
    userId: string;
    ad_text: string;
    pick_time: string;
    pick_address: string;
    categoryIds: Array<string>;
    bannerIds: Array<string>;
}

const communitySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    ad_text: String,
    pick_time: String,
    pick_address: String,
    categoryIds: [{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }],
    bannerIds: [{
        type: Schema.Types.ObjectId,
        ref: 'Banner'
    }]
});

export const Community = mongoose.model<ICommunity>('Community', communitySchema);