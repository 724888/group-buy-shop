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
class BannerService {
    static getBanners() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield banner_model_1.Banner.find();
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
}
exports.BannerService = BannerService;
//# sourceMappingURL=banner.service.js.map