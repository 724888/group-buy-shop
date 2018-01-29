import {BannerService} from "../service/banner.service";

export class BannerController {
    static async getIndexBanner(ctx, next) {
        const banners = await BannerService.getBanners();
        ctx.body = banners.filter(b => b.is_activate === true && b.type === 1)
    }

    static async getBannerForCommunity(ctx, next) {
        ctx.body = await BannerService.getBannerFromCommunityId(ctx.params.id);
    }
}