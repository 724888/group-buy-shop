import {settings} from '../config/config.dev';

import * as M from 'mongoose';

const mongoose = settings.mongoose;

const Schema = mongoose.Schema;

export interface ICategory extends M.Document {
    _id: string;
    name: string;
    type: number;
    parentCategory: string;
}

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: Number,
    parentCategory: Schema.Types.ObjectId
});

export const Category = mongoose.model<ICategory>('Category', categorySchema);