"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const group_controller_1 = require("../controller/group.controller");
const router = new Router();
router.post('admin_groups', group_controller_1.GroupController.adminCreateGroup);
exports.groupRouter = router;
//# sourceMappingURL=group.router.js.map