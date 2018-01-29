import * as Router from "koa-router";

import {authRouter} from "./auth.router";

import {bannerRouter} from "./banner.router";

import {communityRouter} from "./community.router";

const router = new Router();

router.use('/api/', authRouter.routes());

router.use('/api/', bannerRouter.routes());

router.use('/api/', communityRouter.routes());

export const mainRouter = router;