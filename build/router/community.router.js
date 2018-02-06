"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const community_controller_1 = require("../controller/community.controller");
const router = new Router();
router.get('communities', community_controller_1.CommunityController.getCommunities);
router.get('communities/:id', community_controller_1.CommunityController.getCommunity);
router.get('admin_communities', community_controller_1.CommunityController.adminGetCommunities);
router.get('admin_communities/:id', community_controller_1.CommunityController.adminGetCommunity);
router.post('admin_communities', community_controller_1.CommunityController.adminCreateCommunity);
router.put('admin_communities/:id', community_controller_1.CommunityController.adminUpdateCommunity);
router.del('admin_communities/:id', community_controller_1.CommunityController.adminDeleteCommunity);
exports.communityRouter = router;
//# sourceMappingURL=community.router.js.map