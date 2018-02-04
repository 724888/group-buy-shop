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
class CommodityController {
    static getCommoditiesFromCommunity(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
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
}
exports.CommodityController = CommodityController;
//# sourceMappingURL=commodity.controller.js.map