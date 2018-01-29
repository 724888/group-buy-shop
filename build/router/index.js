"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const auth_router_1 = require("./auth.router");
const banner_router_1 = require("./banner.router");
const community_router_1 = require("./community.router");
const router = new Router();
router.use('/api/', auth_router_1.authRouter.routes());
router.use('/api/', banner_router_1.bannerRouter.routes());
router.use('/api/', community_router_1.communityRouter.routes());
exports.mainRouter = router;
//# sourceMappingURL=index.js.map