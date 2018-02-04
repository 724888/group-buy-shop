import * as Router from "koa-router";

import {authRouter} from "./auth.router";

import {bannerRouter} from "./banner.router";

import {communityRouter} from "./community.router";

import {categoryRouter} from "./category.router";

import {commodityRouter} from "./commodity.router";

import {utilsRouter} from "./utils.router";

const router = new Router();

router.use('/api/', authRouter.routes());

router.use('/api/', bannerRouter.routes());

router.use('/api/', communityRouter.routes());

router.use('/api/', categoryRouter.routes());

router.use('/api/', commodityRouter.routes());

router.use('/api/', utilsRouter.routes());

export const mainRouter = router;