import {BannerService} from "../service/banner.service";

import * as createHttpError from "http-errors";

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
            if (type == 1 || type == 3) {
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

    static async adminDeleteBanner(ctx, next) {
        if (AuthService.checkIfAdminUser(ctx.state.user)) {
            const res = await BannerService.deleteBannerFromId(ctx.params.id);
            if (res) {
                ctx.status = 204
            } else {
                throw createHttpError(400, '删除轮播图失败')
            }
        }
    }
}