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
const community_model_1 = require("../model/community.model");
const user_model_1 = require("../model/user.model");
const auth_service_1 = require("./auth.service");
const createHttpError = require("http-errors");
const category_model_1 = require("../model/category.model");
const banner_model_1 = require("../model/banner.model");
const commodity_model_1 = require("../model/commodity.model");
class CommunityService {
    static getCommunities(user = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user) {
                return yield community_model_1.Community.find({}, { userId: 0, categoryIds: 0 })
                    .populate('bannerIds');
            }
            else {
                return yield community_model_1.Community.find();
            }
        });
    }
    static getCommunityFromId(id, populate = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (populate) {
                    return yield community_model_1.Community.findOne({ _id: id }, { userId: 0 })
                        .populate('categoryIds bannerIds');
                }
                else {
                    return yield community_model_1.Community.findOne({ _id: id });
                }
            }
            catch (err) {
                throw createHttpError(400, '无效的社区id');
            }
        });
    }
    static saveCommunity(user, name, userId, ad_text, pick_time, pick_address) {
        return __awaiter(this, void 0, void 0, function* () {
            if (auth_service_1.AuthService.checkIfAdminUser(user)) {
                const c = new community_model_1.Community({
                    name: name,
                    userId: userId,
                    ad_text: ad_text,
                    pick_time: pick_time,
                    pick_address: pick_address
                });
                return yield c.save();
            }
        });
    }
    static getCommunityFromAdminUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield community_model_1.Community.findOne({ userId: user._id });
        });
    }
    static updateCommunity(user, id, name, userId, ad_text, pick_time, pick_address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (auth_service_1.AuthService.checkIfAdminUser(user)) {
                    return yield community_model_1.Community.findOneAndUpdate({ _id: id }, {
                        name: name,
                        userId: userId,
                        ad_text: ad_text,
                        pick_time: pick_time,
                        pick_address: pick_address
                    }, { new: true });
                }
            }
            catch (err) {
                throw createHttpError(400, '无效的社区id');
            }
        });
    }
    static deleteCommunity(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const community = yield community_model_1.Community.findOneAndRemove({ _id: id });
                yield user_model_1.User.update({ _id: community.userId }, { usertype: 3 });
                yield category_model_1.Category.remove({ _id: { $in: community.categoryIds } });
                yield banner_model_1.Banner.remove({ _id: { $in: community.bannerIds } });
                yield commodity_model_1.Commodity.remove({ communityId: community._id });
                return true;
            }
            catch (err) {
                return false;
            }
        });
    }
}
exports.CommunityService = CommunityService;
//# sourceMappingURL=community.service.js.map