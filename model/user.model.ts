import {settings} from '../config/config.dev';

import * as md5 from "js-md5";

import * as M from 'mongoose';

const mongoose = settings.mongoose;

const Schema = mongoose.Schema;

export interface IUser extends M.Document {
    _id: string;
    username: string;
    openid: string;
    usertype: number;
    signup_date: string;
}

const userSchema = new Schema({
    username: String,
    openid: String,
    usertype: {
        type: Number,
        default: 3,
        required: true
    },
    signup_date: {
        type: Date,
        default: Date.now,
        required: true
    },
    password: String
});

userSchema.pre('save', function (next) {
    if (this.password) {
        this.password = md5(this.password);
        next()
    } else {
        next()
    }
});

export const User = mongoose.model<IUser>('User', userSchema);