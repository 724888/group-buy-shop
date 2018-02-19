import * as Router from "koa-router";

import {BannerController} from "../controller/banner.controller";

const router = new Router();

router.get('banners', BannerController.getIndexBanners); // 取得首页的轮播图

router.get('banners/:id', BannerController.getBannerFromId);


// For Administrators

router.post('admin_banners', BannerController.adminCreateBanner);

router.get('admin_banners/communities/:id', BannerController.adminGetBannersFromCommunity);

router.del('admin_banners/:id', BannerController.adminDeleteBanner);

export const bannerRouter = router;