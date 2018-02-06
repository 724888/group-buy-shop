import * as Router from "koa-router";

import {CommunityController} from "../controller/community.controller";

const router = new Router();

router.get('communities', CommunityController.getCommunities);  // 取得所有的社区

router.get('communities/:id', CommunityController.getCommunity);  //取得单个社区的详情，包含该社区的所有分类，轮播图等


// For Administrators

router.get('admin_communities', CommunityController.adminGetCommunities);

router.get('admin_communities/:id', CommunityController.adminGetCommunity);

router.post('admin_communities', CommunityController.adminCreateCommunity);

router.put('admin_communities/:id', CommunityController.adminUpdateCommunity);

router.del('admin_communities/:id', CommunityController.adminDeleteCommunity);

export const communityRouter = router;