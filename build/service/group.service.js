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
                .populate('commodityId');
        });
    }
    static createTimeoutCheckJob(groupId, group_time) {
        node_schedule_1.scheduleJob(new Date(group_time), function (id) {
            return __awaiter(this, void 0, void 0, function* () {
                const g = yield group_model_1.Group.findOne({ _id: id });
                if (g.group_attach < g.group_goal) {
                    yield g.update({ status: 2 });
                    yield commodity_model_1.Commodity.update({ _id: g.commodityId }, { status: 0, $unset: { groupId: '' } });
                }
                else {
                    yield g.update({ status: 1 });
                }
            });
        }.bind(null, groupId));
    }
    static patchGroup(id, group_price, group_goal, group_attach, group_time) {
        return __awaiter(this, void 0, void 0, function* () {
            GroupService.createTimeoutCheckJob(id, group_time);
            return yield group_model_1.Group.findOneAndUpdate({ _id: id }, {
                group_price: group_price,
                group_goal: group_goal,
                group_attach: group_attach,
                group_time: group_time
            }, { new: true });
        });
    }
}
exports.GroupService = GroupService;
//# sourceMappingURL=group.service.js.map