import {IGroup, Group} from "../model/group.model";

import {Commodity, ICommodity} from "../model/commodity.model";

import {scheduleJob} from "node-schedule";

import {IOrder, Order} from "../model/order.model";

import {CommunityService} from "./community.service";

export class GroupService {
    static async saveGroup(communityId: string, commodityId: string, group_price: number,
                           group_goal: number, group_attach: number, group_time: number): Promise<IGroup> {
        const g = new Group({
            communityId: communityId,
            commodityId: commodityId,
            group_price: group_price,
            group_goal: group_goal,
            group_attach: group_attach,
            group_time: group_time
        });
        GroupService.createTimeoutCheckJob(g._id, group_time);
        await Commodity.update({_id: g.commodityId}, {groupId: g._id, status: 1});
        return await g.save()
    }

    static async getGroupFromCommunityId(id: string): Promise<Array<IGroup>> {
        return await Group.find({communityId: id})
            .populate('commodityId')
            .sort({'meta.createdAt': -1})
    }

    static createTimeoutCheckJob(groupId: string, group_time: number) {
        scheduleJob(new Date(group_time), async function (id) {
            const g = await Group.findOne({_id: id});
            if (g.group_attach < g.group_goal && g.group_time === new Date().getTime()) {
                await g.update({status: 2});
                await Commodity.update({_id: g.commodityId}, {status: 0, $unset: {groupId: ''}})
            }
        }.bind(null, groupId));
    }

    static async patchGroup(id: string, group_price: number, group_goal: number, group_attach: number, group_time: number): Promise<IGroup> {
        GroupService.createTimeoutCheckJob(id, group_time);
        if (group_time > new Date().getTime() && group_attach < group_goal) {
            const g = await Group.findOneAndUpdate({_id: id}, {
                group_price: group_price,
                group_goal: group_goal,
                group_attach: group_attach,
                group_time: group_time,
                status: 0
            }, {new: true});
            await Commodity.update({_id: g.commodityId}, {groupId: g._id, status: 1});
            return g
        } else {
            return await Group.findOneAndUpdate({_id: id}, {
                group_price: group_price,
                group_goal: group_goal,
                group_attach: group_attach,
                group_time: group_time
            }, {new: true});
        }
    }

    static async payAndCheckGroupIfSuccess(o: IOrder, transaction_id: string): Promise<any> {
        const group = await Group.findOne({_id: o.groupId})
            .populate('commodityId');
        const commodity = await Commodity.findOne({_id: o.commodityId});
        if (group.status !== 0 || group.group_attach + o.quantity > group.group_goal || Date.now() > new Date(group.group_time).getTime()) {
            return {status: -1, group: group, commodity: commodity}
        }
        await commodity.update({
            stock: commodity.stock - o.quantity,
            sales: commodity.sales + o.quantity,
        });
        await o.update({status: 1, transaction_id: transaction_id, is_notify: true});
        if (group.group_attach + o.quantity === group.group_goal) {
            await group.update({group_attach: group.group_goal, status: 1});
            return {status: 1, group: group, commodity: commodity}
        } else {
            await group.update({group_attach: group.group_attach + o.quantity});
            return {status: 0, group: group, commodity: commodity};
        }
    }

    static genPickCode(length): Array<string> {
        let codes = [];
        for (let i =0; i < length; i++) {
            const pick_code = String(Math.floor(Math.random() * 100000));
            codes.push(pick_code)
        }
        return codes
    }

    static async groupSuccess(group: IGroup, commodity: ICommodity) {
        const orders = await Order.find({groupId: group._id, status: 1, is_notify: true});
        const community = await CommunityService.getCommunityFromId((group.commodityId as ICommodity).communityId);
        await commodity.update({status: 0, $unset: {groupId: ''}});
        const pick_codes = GroupService.genPickCode(orders.length);
        for (let i in orders) {
            await orders[i].update({pick_code: pick_codes[i], status: 2, pick_address: community.pick_address, pick_time: community.pick_time});
        }
    }

    static async groupProcessing(group: IGroup) {
  
    }
}