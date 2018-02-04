"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const commodity_controller_1 = require("../controller/commodity.controller");
const router = new Router();
router.post('admin_commodities', commodity_controller_1.CommodityController.adminCreateCommodity);
exports.commodityRouter = router;
//# sourceMappingURL=commodity.router.js.map