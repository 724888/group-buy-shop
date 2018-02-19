import {BannerService} from "../service/banner.service";

import * as createHttpError from "http-errors";


export class BannerController {
    static async getIndexBanners(ctx, next) {
        ctx.body = await BannerService.getBanners({type: 1});
    }

    static async getBannerFromId(ctx, next) {
        ctx.body = await BannerService.getBannerFromId(ctx.params.id);
    }

    static async adminCreateBanner(ctx, next) {
        const {type, communityId} = ctx.request.body.fields;
        if (type == 1 || type == 3) {
            ctx.body = await BannerService.saveBanner(ctx.request.body.files.file, type)
        } else if (type == 2) {
            ctx.body = await BannerService.saveBanner(ctx.request.body.files.file, type, communityId)
        } else {
            throw createHttpError(400, '无效的轮播图信息')
        }
    }

    static async adminGetBannersFromCommunity(ctx, next) {
        ctx.body = await BannerService.getBannerFromCommunityId(ctx.params.id);
    }

    static async adminDeleteBanner(ctx, next) {
        const res = await BannerService.deleteBannerFromId(ctx.params.id);
        if (res) {
            ctx.status = 204
        } else {
            throw createHttpError(400, '删除轮播图失败')
        }
    }
}