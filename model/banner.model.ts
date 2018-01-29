import {settings} from '../config/config.dev';

import * as M from 'mongoose';

const mongoose = settings.mongoose;

const Schema = mongoose.Schema;

export interface IBanner extends M.Document {
    _id: string;
    url: string;
    type: number;
    upload_date: string;
    is_activate: boolean;
}

const bannerSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    type: {
        type: Number,
        required: true
    },
    upload_date: {
        type: Date,
        default: Date.now,
        required: true
    },
    is_activate: {
        type: Boolean,
        default: true
    },
});

export const Banner = mongoose.model<IBanner>('Banner', bannerSchema);
