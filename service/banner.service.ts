import {Banner, IBanner} from "../model/banner.model";

import {Community} from "../model/community.model";

import * as createHttpError from "http-errors";

import * as path from "path";

import {settings} from "../config/config.dev";

import * as fs from "fs";

export class BannerService {
    static async getBanners(condition: object): Promise<Array<IBanner>> {
        return await Banner.find(condition)
    }

    static async getBannerFromCommunityId(communityId: string): Promise<Array<IBanner>> {
        try {
            const community = await Community.findOne({_id: communityId});
            return await Banner.find({_id: {$in: community.bannerIds}});
        } catch (err) {
            throw createHttpError(400, '无效的社区id')
        }
    }

    static createFileName(suffix) {
        return `${Date.now()}${Math.floor(Math.random() * 10000)}.${suffix}`
    }

    static async saveBanner(fileObj: any, type: number, communityId?: string): Promise<IBanner> {
        const uploadPath = path.resolve() + '/static/';
        const fileName = BannerService.createFileName(fileObj.name.split('.')[1]);
        const filePath = path.join(uploadPath + settings.bannerPath + '/', fileName);
        const reader = fs.createReadStream(fileObj.path);
        const writer = fs.createWriteStream(filePath);
        reader.pipe(writer);
        if (type == 1 || type == 3) {
            const banner = new Banner({
                url: `${settings.bannerPath}/${fileName}`,
                type: type
            });
            return await banner.save()
        } else {
            const banner = new Banner({
                url: `${settings.bannerPath}/${fileName}`,
                type: 2
            });
            await banner.save();
            await Community.update({_id: communityId}, {$push: {bannerIds: banner._id}});
            return banner
        }
    }

    static async deleteBannerFromId(id: string): Promise<boolean> {
        try {
            await Banner.remove({_id: id});
            return true;
        } catch (err) {
            return false
        }
    }
}