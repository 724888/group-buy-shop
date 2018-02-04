import * as Router from "koa-router";

import {BannerController} from "../controller/banner.controller";
import {Banner} from "../model/banner.model";

const router = new Router();

router.get('banners', BannerController.getIndexBanner);

router.get('banners/communities/:id', BannerController.getBannerForCommunity);


// For Administrators

router.post('admin_banners', BannerController.adminCreateBanner);

router.get('admin_banners/communities/:id', BannerController.adminGetBannersFromCommunity);

router.del('admin_banners/:id', BannerController.adminDeleteBanner);

export const bannerRouter = router;