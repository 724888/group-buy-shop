import {CommodityService} from "../service/commodity.service";

export class CommodityController {
    static async getCommoditiesFromCommunity(ctx, next) {

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
}