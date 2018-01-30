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
const auth_service_1 = require("./auth.service");
const createHttpError = require("http-errors");
class CommunityService {
    static getCommunities() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield community_model_1.Community.find();
        });
    }
    static getCommunityFromId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield community_model_1.Community.findOne({ _id: id });
            }
            catch (err) {
                throw createHttpError(400, '无效的社区id');
            }
        });
    }
    static saveCommunity(user, name, userId, ad_text) {
        return __awaiter(this, void 0, void 0, function* () {
            if (auth_service_1.AuthService.checkIfAdminUser(user)) {
                const c = new community_model_1.Community({
                    name: name,
                    userId: userId,
                    ad_text: ad_text
                });
                return yield c.save();
            }
        });
    }
}
exports.CommunityService = CommunityService;
//# sourceMappingURL=community.service.js.map