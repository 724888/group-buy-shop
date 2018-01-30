import {Community, ICommunity} from "../model/community.model";

import {IUser} from "../model/user.model";

import {AuthService} from "./auth.service";

import * as createHttpError from "http-errors";

export class CommunityService {
    static async getCommunities(): Promise<Array<ICommunity>> {
        return await Community.find();
    }

    static async getCommunityFromId(id: string): Promise<ICommunity> {
        try {
            return await Community.findOne({_id: id})
        } catch (err) {
            throw createHttpError(400, '无效的社区id')
        }
    }

    static async saveCommunity(user: IUser, name: string, userId: string, ad_text: string): Promise<ICommunity> {
        if (AuthService.checkIfAdminUser(user)) {
            const c = new Community({
                name: name,
                userId: userId,
                ad_text: ad_text
            });
            return await c.save()
        }
    }
}