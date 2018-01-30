import {CommunityService} from "../service/community.service";

import {AuthService} from "../service/auth.service";

import * as createHttpError from "http-errors";

export class CommunityController {
    static async getCommunities(ctx, next) {
        ctx.body = await CommunityService.getCommunities();
    }

    static async adminGetCommunities(ctx, next) {
        const user = await AuthService.adminGetuserFromHeaderToken(ctx);
        if (user.usertype === 1) {
            ctx.body =  await CommunityService.getCommunities()
        } else {
            const c = await CommunityService.getCommunities();
            ctx.body =  c.filter(c => c.userId.toString() == user._id.toString())
        }
    }

    static async adminGetCommunity(ctx, next) {
        const user = await AuthService.adminGetuserFromHeaderToken(ctx);
        if (user.usertype === 1) {
            ctx.body = await CommunityService.getCommunityFromId(ctx.params.id)
        } else {
            const c = await CommunityService.getCommunityFromId(ctx.params.id);
            if (c.userId.toString() === user._id.toString()) {
                ctx.body = c
            } else {
                throw createHttpError(403)
            }
        }
    }

    static async adminCreateCommunity(ctx, next) {
        const name = ctx.request.body.name;
        const userId = ctx.request.body.userId;
        const ad_text = ctx.request.body.ad_text;
        ctx.body = await CommunityService.saveCommunity(ctx.state.user, name, userId, ad_text)
    }
}