import {settings} from '../config/config.dev';

import * as M from 'mongoose';

const mongoose = settings.mongoose;

const Schema = mongoose.Schema;

export interface ICategory extends M.Document {
    _id: string;
    name: string;
    childCategory: Array<ICategory>;
}

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    childCategory: [Schema.Types.Mixed]
});

export const Category = mongoose.model<ICategory>('Category', categorySchema);