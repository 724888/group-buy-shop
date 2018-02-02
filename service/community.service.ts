import {Community, ICommunity} from "../model/community.model";

import {IUser, User} from "../model/user.model";

import {AuthService} from "./auth.service";

import * as createHttpError from "http-errors";

import {Category} from "../model/category.model";

import {Banner} from "../model/banner.model";

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

    static async getCommunityFromAdminUser(user: IUser): Promise<ICommunity> {
        return await Community.findOne({userId: user._id});
    }

    static async updateCommunity(user: IUser, id: string, name: string, userId: string, ad_text: string): Promise<ICommunity> {
        try {
            if (AuthService.checkIfAdminUser(user)) {
                return await Community.findOneAndUpdate({_id: id}, {name: name, userId: userId, ad_text: ad_text}, {new: true})
            }
        } catch (err) {
            throw createHttpError(400, '无效的社区id')
        }
    }

    static async deleteCommunity(id: string): Promise<boolean> {
        try {
            const community = await Community.findOneAndRemove({_id: id});
            await User.update({_id: community.userId}, {usertype: 3});
            await Category.remove({_id: {$in: community.categoryIds}});
            await Banner.remove({_id: {$in: community.bannerIds}});
            return true
        } catch (err) {
            return false
        }
    }

}