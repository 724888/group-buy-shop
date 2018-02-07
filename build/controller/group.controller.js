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
const group_service_1 = require("../service/group.service");
const createHttpError = require("http-errors");
class GroupController {
    static adminCreateGroup(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { communityId, commodityId, group_price, group_goal, group_attach, group_time } = ctx.request.body;
            ctx.body = yield group_service_1.GroupService.saveGroup(communityId, commodityId, group_price, group_goal, group_attach, group_time);
        });
    }
    static adminGetGroupFromCommunity(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            ctx.body = yield group_service_1.GroupService.getGroupFromCommunityId(ctx.params.id);
        });
    }
    static adminUpdateGroup(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { group_price, group_goal, group_attach, group_time } = ctx.request.body;
            const now = new Date().getTime();
            if (now >= group_time) {
                throw createHttpError(400, '无效的拼团时间');
            }
            ctx.body = yield group_service_1.GroupService.patchGroup(ctx.params.id, group_price, group_goal, group_attach, group_time);
        });
    }
}
exports.GroupController = GroupController;
//# sourceMappingURL=group.controller.js.map