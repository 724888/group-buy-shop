"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const banner_controller_1 = require("../controller/banner.controller");
const router = new Router();
router.get('banners', banner_controller_1.BannerController.getIndexBanner);
router.get('banners/communities/:id', banner_controller_1.BannerController.getBannerForCommunity);
exports.bannerRouter = router;
//# sourceMappingURL=banner.router.js.map