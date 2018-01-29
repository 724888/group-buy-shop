"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_dev_1 = require("../config/config.dev");
const mongoose = config_dev_1.settings.mongoose;
const Schema = mongoose.Schema;
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
    categoryIds: [Schema.Types.ObjectId],
    bannerIds: [Schema.Types.ObjectId]
});
exports.Community = mongoose.model('Community', communitySchema);
//# sourceMappingURL=community.model.js.map