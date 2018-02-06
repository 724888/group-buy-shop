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
const commodity_service_1 = require("../service/commodity.service");
const createHttpError = require("http-errors");
class CommodityController {
    static getCommoditiesFromCommunity(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            ctx.body = yield commodity_service_1.CommodityService.getCommoditiesFromCommunity(ctx.params.id, true, ctx.request.query);
        });
    }
    static getCommoditiesFromCategory(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            ctx.body = yield commodity_service_1.CommodityService.getCommoditiesFromCategory(ctx.params.id);
        });
    }
    static adminCreateCommodity(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const commodityInfo = ctx.request.body;
            const specs = [];
            commodityInfo.specs.forEach(v => specs.push(v.name));
            commodityInfo.specs = specs;
            ctx.body = yield commodity_service_1.CommodityService.saveCommodity(commodityInfo.name, commodityInfo.bannerIds, commodityInfo.communityId, commodityInfo.categoryId, commodityInfo.price, commodityInfo.stock, commodityInfo.specs, commodityInfo.content, commodityInfo.is_hot, commodityInfo.is_commend);
        });
    }
    static adminGetCommoditiesFromCommunity(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            ctx.body = yield commodity_service_1.CommodityService.getCommoditiesFromCommunity(ctx.params.id, false);
        });
    }
    static adminUpdateCommodity(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const commodityInfo = ctx.request.body;
            const specs = [];
            commodityInfo.specs.forEach(v => specs.push(v.name));
            commodityInfo.specs = specs;
            ctx.body = yield commodity_service_1.CommodityService.updateCommodity(ctx.params.id, commodityInfo.name, commodityInfo.bannerIds, commodityInfo.communityId, commodityInfo.categoryId, commodityInfo.price, commodityInfo.stock, commodityInfo.specs, commodityInfo.content, commodityInfo.is_hot, commodityInfo.is_commend);
        });
    }
    static adminDeleteCommodity(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield commodity_service_1.CommodityService.deleteCommodity(ctx.params.id);
            if (res) {
                ctx.status = 204;
            }
            else {
                throw createHttpError(400, '删除商品失败');
            }
        });
    }
}
exports.CommodityController = CommodityController;
//# sourceMappingURL=commodity.controller.js.map