import {Commodity, ICommodity} from "../model/commodity.model";

import {Banner} from "../model/banner.model";

import * as _ from "lodash";
import {Group} from "../model/group.model";

export class CommodityService {
    static async saveCommodity(name: string, bannerIds: string[], communityId: string,
                               categoryId: string, price: number, stock: number,
                               specs: string[], content: string, is_hot: boolean, is_commend: boolean): Promise<ICommodity> {
        const c = new Commodity({
            name: name,
            bannerIds: bannerIds,
            communityId: communityId,
            categoryId: categoryId,
            price: price,
            stock: stock,
            specs: specs,
            content: content,
            is_hot: is_hot,
            is_commend: is_commend
        });
        return await c.save()
    }

    static async getCommodityFromId(id: string): Promise<ICommodity> {
        return await Commodity.findOne({_id: id})
            .populate('categoryId groupId bannerIds')
    }

    static async updateCommodity(id: string, name: string, bannerIds: string[], communityId: string,
                                 categoryId: string, price: number, stock: number,
                                 specs: string[], content: string, is_hot: boolean, is_commend: boolean): Promise<ICommodity> {
        return await Commodity.findOneAndUpdate({_id: id}, {
            name: name,
            bannerIds: bannerIds,
            communityId: communityId,
            categoryId: categoryId,
            price: price,
            stock: stock,
            specs: specs,
            content: content,
            is_hot: is_hot,
            is_commend: is_commend
        }, {new: true});
    }

    static async getCommoditiesFromCommunity(id: string, user: boolean = false, query?: any): Promise<Array<ICommodity>> {
        if (user) {
            if (query) {
                query.communityId = id;
                query.status = {$ne: 0};
                const filterQuery = _.pick(query, ['is_commend', 'is_hot', 'communityId', 'status']);
                return await Commodity.find(filterQuery, {content: 0, specs: 0, communityId: 0, status: 0, meta: 0})
                    .populate('bannerIds groupId categoryId')
            }
        } else {
            return await Commodity.find({communityId: id})
                .populate('bannerIds')
        }
    }

    static async getCommoditiesFromCategory(id: string): Promise<Array<ICommodity>> {
        return await Commodity.find({categoryId: id, status: {$ne: 0}}, {content: 0, specs: 0, communityId: 0, status: 0, meta: 0})
            .populate('communityId categoryId bannerIds groupId')
    }


    static async deleteCommodity(id: string): Promise<boolean> {
        try {
            const c = await Commodity.findOneAndRemove({_id: id});
            await Banner.remove({_id: {$in: c.bannerIds}});
            await Group.remove({commodityId: id});
            return true
        } catch (err) {
            return false
        }
    }
}