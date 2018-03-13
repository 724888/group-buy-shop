"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const group_model_1 = require("../model/group.model");
const commodity_model_1 = require("../model/commodity.model");
const node_schedule_1 = require("node-schedule");
const order_model_1 = require("../model/order.model");
const community_service_1 = require("./community.service");
class GroupService {
    static saveGroup(communityId, commodityId, group_price, group_goal, group_attach, group_time) {
        return __awaiter(this, void 0, void 0, function* () {
            const g = new group_model_1.Group({
                communityId: communityId,
                commodityId: commodityId,
                group_price: group_price,
                group_goal: group_goal,
                group_attach: group_attach,
                group_time: group_time
            });
            GroupService.createTimeoutCheckJob(g._id, group_time);
            yield commodity_model_1.Commodity.update({ _id: g.commodityId }, { groupId: g._id, status: 1 });
            return yield g.save();
        });
    }
    static getGroupFromCommunityId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield group_model_1.Group.find({ communityId: id })
                .populate('commodityId')
                .sort({ 'meta.createdAt': -1 });
        });
    }
    static createTimeoutCheckJob(groupId, group_time) {
        node_schedule_1.scheduleJob(new Date(group_time), function (id) {
            return __awaiter(this, void 0, void 0, function* () {
                const g = yield group_model_1.Group.findOne({ _id: id });
                if (g.group_attach < g.group_goal && g.group_time === new Date().getTime()) {
                    yield g.update({ status: 2 });
                    yield commodity_model_1.Commodity.update({ _id: g.commodityId }, { status: 0, $unset: { groupId: '' } });
                }
            });
        }.bind(null, groupId));
    }
    static patchGroup(id, group_price, group_goal, group_attach, group_time) {
        return __awaiter(this, void 0, void 0, function* () {
            GroupService.createTimeoutCheckJob(id, group_time);
            if (group_time > new Date().getTime() && group_attach < group_goal) {
                const g = yield group_model_1.Group.findOneAndUpdate({ _id: id }, {
                    group_price: group_price,
                    group_goal: group_goal,
                    group_attach: group_attach,
                    group_time: group_time,
                    status: 0
                }, { new: true });
                yield commodity_model_1.Commodity.update({ _id: g.commodityId }, { groupId: g._id, status: 1 });
                return g;
            }
            else {
                return yield group_model_1.Group.findOneAndUpdate({ _id: id }, {
                    group_price: group_price,
                    group_goal: group_goal,
                    group_attach: group_attach,
                    group_time: group_time
                }, { new: true });
            }
        });
    }
    static payAndCheckGroupIfSuccess(o, transaction_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield group_model_1.Group.findOne({ _id: o.groupId })
                .populate('commodityId');
            const commodity = yield commodity_model_1.Commodity.findOne({ _id: o.commodityId });
            if (group.status !== 0 || group.group_attach + o.quantity > group.group_goal || Date.now() > new Date(group.group_time).getTime()) {
                return { status: -1, group: group, commodity: commodity };
            }
            yield commodity.update({
                stock: commodity.stock - o.quantity,
                sales: commodity.sales + o.quantity,
            });
            yield o.update({ status: 1, transaction_id: transaction_id, is_notify: true });
            if (group.group_attach + o.quantity === group.group_goal) {
                yield group.update({ group_attach: group.group_goal, status: 1 });
                return { status: 1, group: group, commodity: commodity };
            }
            else {
                yield group.update({ group_attach: group.group_attach + o.quantity });
                return { status: 0, group: group, commodity: commodity };
            }
        });
    }
    static genPickCode(length) {
        let codes = [];
        for (let i = 0; i < length; i++) {
            const pick_code = String(Math.floor(Math.random() * 100000));
            codes.push(pick_code);
        }
        return codes;
    }
    static groupSuccess(group, commodity) {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield order_model_1.Order.find({ groupId: group._id, status: 1, is_notify: true });
            const community = yield community_service_1.CommunityService.getCommunityFromId(group.commodityId.communityId);
            yield commodity.update({ status: 0, $unset: { groupId: '' } });
            const pick_codes = GroupService.genPickCode(orders.length);
            for (let i in orders) {
                yield orders[i].update({ pick_code: pick_codes[i], status: 2, pick_address: community.pick_address, pick_time: community.pick_time });
            }
        });
    }
    static groupProcessing(group) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.GroupService = GroupService;
//# sourceMappingURL=group.service.js.map