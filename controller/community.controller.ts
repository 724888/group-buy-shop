import {CommunityService} from "../service/community.service";

import {AuthService} from "../service/auth.service";

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
            ctx.body =  c.filter(c => c.userId === user._id)
        }
    }
}