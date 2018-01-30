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
const community_service_1 = require("../service/community.service");
const auth_service_1 = require("../service/auth.service");
const createHttpError = require("http-errors");
class CommunityController {
    static getCommunities(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            ctx.body = yield community_service_1.CommunityService.getCommunities();
        });
    }
    static adminGetCommunities(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield auth_service_1.AuthService.adminGetuserFromHeaderToken(ctx);
            if (user.usertype === 1) {
                ctx.body = yield community_service_1.CommunityService.getCommunities();
            }
            else {
                const c = yield community_service_1.CommunityService.getCommunities();
                ctx.body = c.filter(c => c.userId.toString() == user._id.toString());
            }
        });
    }
    static adminGetCommunity(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield auth_service_1.AuthService.adminGetuserFromHeaderToken(ctx);
            if (user.usertype === 1) {
                ctx.body = yield community_service_1.CommunityService.getCommunityFromId(ctx.params.id);
            }
            else {
                const c = yield community_service_1.CommunityService.getCommunityFromId(ctx.params.id);
                if (c.userId.toString() === user._id.toString()) {
                    ctx.body = c;
                }
                else {
                    throw createHttpError(403);
                }
            }
        });
    }
    static adminCreateCommunity(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const name = ctx.request.body.name;
            const userId = ctx.request.body.userId;
            const ad_text = ctx.request.body.ad_text;
            ctx.body = yield community_service_1.CommunityService.saveCommunity(ctx.state.user, name, userId, ad_text);
        });
    }
}
exports.CommunityController = CommunityController;
//# sourceMappingURL=community.controller.js.map