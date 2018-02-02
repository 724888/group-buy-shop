import * as Router from "koa-router";

import {CommunityController} from "../controller/community.controller";

const router = new Router();

router.get('communities', CommunityController.getCommunities);


// For Administrators

router.get('admin_communities', CommunityController.adminGetCommunities);

router.get('admin_communities/:id', CommunityController.adminGetCommunity);

router.post('admin_communities', CommunityController.adminCreateCommunity);

router.put('admin_communities/:id', CommunityController.adminupdateCommunity);

router.del('admin_communities/:id', CommunityController.adminDeleteCommunity);

export const communityRouter = router;