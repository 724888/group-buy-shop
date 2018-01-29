import * as Router from "koa-router";

import {BannerController} from "../controller/banner.controller";

const router = new Router();

router.get('banners', BannerController.getIndexBanner);

router.get('banners/communities/:id', BannerController.getBannerForCommunity)

export const bannerRouter = router;