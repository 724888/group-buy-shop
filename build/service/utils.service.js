"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_dev_1 = require("../config/config.dev");
const fs = require("fs");
const path = require("path");
class UtilsService {
    static createFileName(suffix) {
        return `${Date.now()}${Math.floor(Math.random() * 10000)}.${suffix}`;
    }
    static saveFile(fileObj) {
        try {
            const uploadPath = path.resolve() + '/static/';
            const fileName = UtilsService.createFileName(fileObj.name.split('.')[1]);
            const filePath = path.join(uploadPath + config_dev_1.settings.uploadImgPath + '/', fileName);
            const reader = fs.createReadStream(fileObj.path);
            const writer = fs.createWriteStream(filePath);
            reader.pipe(writer);
            return fileName;
        }
        catch (err) {
            return null;
        }
    }
}
exports.UtilsService = UtilsService;
//# sourceMappingURL=utils.service.js.map