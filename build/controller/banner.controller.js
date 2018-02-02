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
const banner_service_1 = require("../service/banner.service");
const createHttpError = require("http-errors");
const auth_service_1 = require("../service/auth.service");
class BannerController {
    static getIndexBanner(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            ctx.body = yield banner_service_1.BannerService.getBanners({ type: 1 });
        });
    }
    static getBannerForCommunity(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            ctx.body = yield banner_service_1.BannerService.getBannerFromCommunityId(ctx.params.id);
        });
    }
    static adminCreateBanner(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (auth_service_1.AuthService.checkIfAdminUser(ctx.state.user)) {
                const { type, communityId } = ctx.request.body.fields;
                if (type == 1) {
                    ctx.body = yield banner_service_1.BannerService.saveBanner(ctx.request.body.files.file, type);
                }
                else if (type == 2) {
                    ctx.body = yield banner_service_1.BannerService.saveBanner(ctx.request.body.files.file, type, communityId);
                }
                else {
                    throw createHttpError(400, '无效的轮播图信息');
                }
            }
        });
    }
    static adminGetBannersFromCommunity(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            ctx.body = yield banner_service_1.BannerService.getBannerFromCommunityId(ctx.params.id);
        });
    }
}
exports.BannerController = BannerController;
//# sourceMappingURL=banner.controller.js.map