import {Banner, IBanner} from "../model/banner.model";

import {Community} from "../model/community.model";

import * as createHttpError from "http-errors";

export class BannerService {
    static async getBanners(): Promise<Array<IBanner>> {
        return await Banner.find();
    }

    static async getBannerFromCommunityId(communityId: string): Promise<Array<IBanner>> {
        try {
            const community = await Community.findOne({_id: communityId});
            return await Banner.find({_id: {$in: community.bannerIds}});
        } catch (err) {
            throw createHttpError(400, '无效的社区id')
        }
    }
}