"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_dev_1 = require("../config/config.dev");
const mongoose = config_dev_1.settings.mongoose;
const Schema = mongoose.Schema;
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
exports.Banner = mongoose.model('Banner', bannerSchema);
//# sourceMappingURL=banner.model.js.map