"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const auth_router_1 = require("./auth.router");
const banner_router_1 = require("./banner.router");
const community_router_1 = require("./community.router");
const category_router_1 = require("./category.router");
const router = new Router();
router.use('/api/', auth_router_1.authRouter.routes());
router.use('/api/', banner_router_1.bannerRouter.routes());
router.use('/api/', community_router_1.communityRouter.routes());
router.use('/api/', category_router_1.categoryRouter.routes());
exports.mainRouter = router;
//# sourceMappingURL=index.js.map