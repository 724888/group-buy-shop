import {Community, ICommunity} from "../model/community.model";

import {IUser, User} from "../model/user.model";

import {AuthService} from "./auth.service";

import * as createHttpError from "http-errors";

import {Category} from "../model/category.model";

import {Banner} from "../model/banner.model";

import {Commodity} from "../model/commodity.model";

export class CommunityService {
    static async getCommunities(user: boolean = false): Promise<Array<ICommunity>> {
        if (user) {
            return await Community.find({}, {userId: 0, categoryIds: 0})
                .populate('bannerIds')
        } else {
            return await Community.find()
        }
    }

    static async getCommunityFromId(id: string, populate: boolean = false): Promise<ICommunity> {
        try {
            if (populate) {
                return await Community.findOne({_id: id}, {userId: 0})
                    .populate('categoryIds bannerIds')
            } else {
                return await Community.findOne({_id: id})
            }
        } catch (err) {
            throw createHttpError(400, '无效的社区id')
        }
    }

    static async saveCommunity(user: IUser, name: string, userId: string, ad_text: string,
                               pick_time: string, pick_address: string): Promise<ICommunity> {
        if (AuthService.checkIfAdminUser(user)) {
            const c = new Community({
                name: name,
                userId: userId,
                ad_text: ad_text,
                pick_time: pick_time,
                pick_address: pick_address
            });
            return await c.save()
        }
    }

    static async getCommunityFromAdminUser(user: IUser): Promise<ICommunity> {
        return await Community.findOne({userId: user._id});
    }

    static async updateCommunity(user: IUser, id: string, name: string, userId: string, ad_text: string,
                                 pick_time: string, pick_address: string): Promise<ICommunity> {
        try {
            if (AuthService.checkIfAdminUser(user)) {
                return await Community.findOneAndUpdate({_id: id}, {
                    name: name,
                    userId: userId,
                    ad_text: ad_text,
                    pick_time: pick_time,
                    pick_address: pick_address
                }, {new: true})
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
            await Commodity.remove({communityId: community._id});
            return true
        } catch (err) {
            return false
        }
    }

}