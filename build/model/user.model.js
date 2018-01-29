"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_dev_1 = require("../config/config.dev");
const md5 = require("js-md5");
const mongoose = config_dev_1.settings.mongoose;
const Schema = mongoose.Schema;
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
        next();
    }
    else {
        next();
    }
});
exports.User = mongoose.model('User', userSchema);
//# sourceMappingURL=user.model.js.map