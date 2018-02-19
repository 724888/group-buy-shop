"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const banner_model_1 = require("../model/banner.model");
const community_model_1 = require("../model/community.model");
const createHttpError = require("http-errors");
const path = require("path");
const config_dev_1 = require("../config/config.dev");
const fs = require("fs");
const commodity_model_1 = require("../model/commodity.model");
class BannerService {
    static getBanners(condition) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield banner_model_1.Banner.find(condition);
        });
    }
    static getBannerFromId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield banner_model_1.Banner.findOne({ _id: id });
            }
            catch (err) {
                throw createHttpError(400, '无效的轮播图id');
            }
        });
    }
    static getBannerFromCommunityId(communityId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const community = yield community_model_1.Community.findOne({ _id: communityId });
                return yield banner_model_1.Banner.find({ _id: { $in: community.bannerIds } });
            }
            catch (err) {
                throw createHttpError(400, '无效的社区id');
            }
        });
    }
    static createFileName(suffix) {
        return `${Date.now()}${Math.floor(Math.random() * 10000)}.${suffix}`;
    }
    static saveBanner(fileObj, type, communityId) {
        return __awaiter(this, void 0, void 0, function* () {
            const uploadPath = path.resolve() + '/static/';
            const fileName = BannerService.createFileName(fileObj.name.split('.')[1]);
            const filePath = path.join(uploadPath + config_dev_1.settings.bannerPath + '/', fileName);
            const reader = fs.createReadStream(fileObj.path);
            const writer = fs.createWriteStream(filePath);
            reader.pipe(writer);
            if (type == 1 || type == 3) {
                const banner = new banner_model_1.Banner({
                    url: `${config_dev_1.settings.bannerPath}/${fileName}`,
                    type: type
                });
                return yield banner.save();
            }
            else {
                const banner = new banner_model_1.Banner({
                    url: `${config_dev_1.settings.bannerPath}/${fileName}`,
                    type: 2
                });
                yield banner.save();
                yield community_model_1.Community.update({ _id: communityId }, { $push: { bannerIds: banner._id } });
                return banner;
            }
        });
    }
    static deleteBannerFromId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const b = yield banner_model_1.Banner.findOneAndRemove({ _id: id });
                if (b.type === 1) {
                    return true;
                }
                else if (b.type === 2) {
                    yield community_model_1.Community.update({ bannerIds: b._id }, { $pull: { bannerIds: b._id } });
                    return true;
                }
                else if (b.type === 3) {
                    yield commodity_model_1.Commodity.update({ bannerIds: b._id }, { $pull: { bannerIds: b._id } });
                    return true;
                }
            }
            catch (err) {
                return false;
            }
        });
    }
}
exports.BannerService = BannerService;
//# sourceMappingURL=banner.service.js.map