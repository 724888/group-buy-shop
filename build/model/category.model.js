"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_dev_1 = require("../config/config.dev");
const mongoose = config_dev_1.settings.mongoose;
const Schema = mongoose.Schema;
const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    childCategory: [Schema.Types.Mixed]
});
exports.Category = mongoose.model('Category', categorySchema);
//# sourceMappingURL=category.model.js.map