"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const community_controller_1 = require("../controller/community.controller");
const router = new Router();
router.get('communities', community_controller_1.CommunityController.getCommunities);
router.get('admin_communities', community_controller_1.CommunityController.adminGetCommunities);
exports.communityRouter = router;
//# sourceMappingURL=community.router.js.map