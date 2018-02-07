import {GroupService} from "../service/group.service";

import * as createHttpError from "http-errors";

export class GroupController {
    static async adminCreateGroup(ctx, next) {
        const {communityId, commodityId, group_price, group_goal, group_attach, group_time} = ctx.request.body;
        ctx.body = await GroupService.saveGroup(communityId, commodityId, group_price, group_goal, group_attach, group_time);
    }

    static async adminGetGroupFromCommunity(ctx, next) {
        ctx.body = await GroupService.getGroupFromCommunityId(ctx.params.id);
    }

    static async adminUpdateGroup(ctx, next) {
        const {group_price, group_goal, group_attach, group_time} = ctx.request.body;
        const now = new Date().getTime();
        if (now >= group_time) {
            throw createHttpError(400, '无效的拼团时间')
        }
        ctx.body = await GroupService.patchGroup(ctx.params.id, group_price, group_goal, group_attach, group_time);
    }
}