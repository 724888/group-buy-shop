import {CommunityService} from "../service/community.service";

import {AuthService} from "../service/auth.service";

import * as createHttpError from "http-errors";

export class CommunityController {
    static async getCommunities(ctx, next) {
        ctx.body = await CommunityService.getCommunities(true);
    }

    static async getCommunity(ctx, next) {
        ctx.body = await CommunityService.getCommunityFromId(ctx.params.id, true)
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
        const {name, userId, ad_text, pick_address, pick_time} = ctx.request.body;
        ctx.body = await CommunityService.saveCommunity(ctx.state.user, name, userId, ad_text, pick_time, pick_address)
    }

    static async adminUpdateCommunity(ctx, next) {
        const {name, userId, ad_text, pick_time, pick_address} = ctx.request.body;
        ctx.body = await CommunityService.updateCommunity(ctx.state.user, ctx.params.id, name, userId, ad_text, pick_time, pick_address);
    }

    static async adminDeleteCommunity(ctx, next) {
        if (AuthService.checkIfAdminUser(ctx.state.user)) {
            const res = await CommunityService.deleteCommunity(ctx.params.id);
            if (res) {
                ctx.status = 204
            } else {
                throw createHttpError(400, '删除该社区失败')
            }
        }
    }
}