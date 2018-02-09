import * as Router from "koa-router";

import {authRouter} from "./auth.router";

import {bannerRouter} from "./banner.router";

import {communityRouter} from "./community.router";

import {categoryRouter} from "./category.router";

import {commodityRouter} from "./commodity.router";

import {utilsRouter} from "./utils.router";

import {groupRouter} from "./group.router";

import {orderRouter} from "./order.router";

const router = new Router();

router.use('/api/', authRouter.routes());

router.use('/api/', bannerRouter.routes());

router.use('/api/', communityRouter.routes());

router.use('/api/', categoryRouter.routes());

router.use('/api/', commodityRouter.routes());

router.use('/api/', utilsRouter.routes());

router.use('/api/', groupRouter.routes());

router.use('/api/', orderRouter.routes());

export const mainRouter = router;