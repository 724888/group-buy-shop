import * as Router from "koa-router";

import {CommunityController} from "../controller/community.controller";

const router = new Router();

router.get('communities', CommunityController.getCommunities);



router.get('admin_communities', CommunityController.adminGetCommunities);

export const communityRouter = router;