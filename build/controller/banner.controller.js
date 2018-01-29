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
class BannerController {
    static getIndexBanner(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const banners = yield banner_service_1.BannerService.getBanners();
            ctx.body = banners.filter(b => b.is_activate === true && b.type === 1);
        });
    }
    static getBannerForCommunity(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            ctx.body = yield banner_service_1.BannerService.getBannerFromCommunityId(ctx.params.id);
        });
    }
}
exports.BannerController = BannerController;
//# sourceMappingURL=banner.controller.js.map