import * as Router from "koa-router";

import {authRouter} from "./auth.router";

import {bannerRouter} from "./banner.router";

import {communityRouter} from "./community.router";

import {categoryRouter} from "./category.router";

const router = new Router();

router.use('/api/', authRouter.routes());

router.use('/api/', bannerRouter.routes());

router.use('/api/', communityRouter.routes());

router.use('/api/', categoryRouter.routes());

export const mainRouter = router;