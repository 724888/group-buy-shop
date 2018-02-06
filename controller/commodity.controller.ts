import {CommodityService} from "../service/commodity.service";

import * as createHttpError from "http-errors";

export class CommodityController {
    static async getCommoditiesFromCommunity(ctx, next) {
        ctx.body = await CommodityService.getCommoditiesFromCommunity(ctx.params.id, true, ctx.request.query)
    }

    static async getCommoditiesFromCategory(ctx, next) {
        ctx.body = await CommodityService.getCommoditiesFromCategory(ctx.params.id)
    }

    static async adminCreateCommodity(ctx, next) {
        const commodityInfo = ctx.request.body;
        const specs = [];
        commodityInfo.specs.forEach(v => specs.push(v.name));
        commodityInfo.specs = specs;
        ctx.body = await CommodityService.saveCommodity(commodityInfo.name, commodityInfo.bannerIds,
            commodityInfo.communityId, commodityInfo.categoryId, commodityInfo.price, commodityInfo.stock,
            commodityInfo.specs, commodityInfo.content, commodityInfo.is_hot, commodityInfo.is_commend);
    }

    static async adminGetCommoditiesFromCommunity(ctx, next) {
        ctx.body = await CommodityService.getCommoditiesFromCommunity(ctx.params.id, false)
    }

    static async adminUpdateCommodity(ctx, next) {
        const commodityInfo = ctx.request.body;
        const specs = [];
        commodityInfo.specs.forEach(v => specs.push(v.name));
        commodityInfo.specs = specs;
        ctx.body = await CommodityService.updateCommodity(ctx.params.id, commodityInfo.name, commodityInfo.bannerIds,
            commodityInfo.communityId, commodityInfo.categoryId, commodityInfo.price, commodityInfo.stock,
            commodityInfo.specs, commodityInfo.content, commodityInfo.is_hot, commodityInfo.is_commend);
    }

    static async adminDeleteCommodity(ctx, next) {
        const res = await CommodityService.deleteCommodity(ctx.params.id);
        if (res) {
            ctx.status = 204
        } else {
            throw createHttpError(400, '删除商品失败');
        }
    }

}