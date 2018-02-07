"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const group_controller_1 = require("../controller/group.controller");
const router = new Router();
router.post('admin_groups', group_controller_1.GroupController.adminCreateGroup);
router.get('admin_groups/communities/:id', group_controller_1.GroupController.adminGetGroupFromCommunity);
router.patch('admin_groups/:id', group_controller_1.GroupController.adminUpdateGroup);
exports.groupRouter = router;
//# sourceMappingURL=group.router.js.map