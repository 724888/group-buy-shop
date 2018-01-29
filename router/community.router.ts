import * as Router from "koa-router";

import {CommunityController} from "../controller/community.controller";

const router = new Router();

router.get('communities', CommunityController.getCommunities);

export const communityRouter = router;