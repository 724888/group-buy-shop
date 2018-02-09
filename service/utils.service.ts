import {settings} from "../config/config.dev";
import * as fs from "fs";
import * as path from "path";

export class UtilsService {
    static genRandomString(len, extString = '') {
        len = len || 32;
        let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        let maxPos = $chars.length;
        let pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd + extString;
    }

    static createFileName(suffix) {
        return `${Date.now()}${Math.floor(Math.random() * 10000)}.${suffix}`
    }

    static saveFile(fileObj) {
        try {
            const uploadPath = path.resolve() + '/static/';
            const fileName = UtilsService.createFileName(fileObj.name.split('.')[1]);
            const filePath = path.join(uploadPath + settings.uploadImgPath + '/', fileName);
            const reader = fs.createReadStream(fileObj.path);
            const writer = fs.createWriteStream(filePath);
            reader.pipe(writer);
            return fileName
        } catch (err) {
            return null
        }
    }
}