import {BannerService} from "../service/banner.service";

import createHttpError = require("http-errors");

import {AuthService} from "../service/auth.service";


export class BannerController {
    static async getIndexBanner(ctx, next) {
        ctx.body = await BannerService.getBanners({type: 1});
    }

    static async getBannerForCommunity(ctx, next) {
        ctx.body = await BannerService.getBannerFromCommunityId(ctx.params.id);
    }

    static async adminCreateBanner(ctx, next) {
        if (AuthService.checkIfAdminUser(ctx.state.user)) {
            const {type, communityId} = ctx.request.body.fields;
            if (type == 1) {
                ctx.body = await BannerService.saveBanner(ctx.request.body.files.file, type)
            } else if (type == 2) {
                ctx.body = await BannerService.saveBanner(ctx.request.body.files.file, type, communityId)
            } else {
                throw createHttpError(400, '无效的轮播图信息')
            }
        }
    }

    static async adminGetBannersFromCommunity(ctx, next) {
        ctx.body = await BannerService.getBannerFromCommunityId(ctx.params.id);
    }
}