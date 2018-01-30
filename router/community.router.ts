import * as Router from "koa-router";

import {CommunityController} from "../controller/community.controller";

const router = new Router();

router.get('communities', CommunityController.getCommunities);



router.get('admin_communities', CommunityController.adminGetCommunities);

router.get('admin_communities/:id', CommunityController.adminGetCommunity);

router.post('admin_communities', CommunityController.adminCreateCommunity);

export const communityRouter = router;