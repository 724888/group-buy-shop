import {IGroup, Group} from "../model/group.model";

import {Commodity} from "../model/commodity.model";

import {scheduleJob} from "node-schedule";

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
    }

    static createTimeoutCheckJob(groupId: string, group_time: number) {
        scheduleJob(new Date(group_time), async function (id) {
            const g = await Group.findOne({_id: id});
            if (g.group_attach < g.group_goal) {
                await g.update({status: 2});
                await Commodity.update({_id: g.commodityId}, {status: 0, $unset: {groupId: ''}})
            } else {
                await g.update({status: 1});
                // await Commodity.update({_id: g.commodityId}, {status: 0, $unset: {groupId: ''}})
            }
        }.bind(null, groupId));
    }

    static async patchGroup(id: string, group_price: number, group_goal: number, group_attach: number, group_time: number): Promise<IGroup> {
        GroupService.createTimeoutCheckJob(id, group_time);
        return await Group.findOneAndUpdate({_id: id}, {
            group_price: group_price,
            group_goal: group_goal,
            group_attach: group_attach,
            group_time: group_time
        }, {new: true});
    }
}