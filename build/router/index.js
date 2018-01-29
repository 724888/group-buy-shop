"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const auth_router_1 = require("./auth.router");
const router = new Router();
router.use('/api/', auth_router_1.authRouter.routes());
exports.mainRouter = router;
//# sourceMappingURL=index.js.map