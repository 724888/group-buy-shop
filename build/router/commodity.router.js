"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const commodity_controller_1 = require("../controller/commodity.controller");
const router = new Router();
router.get('commodities/communities/:id', commodity_controller_1.CommodityController.getCommoditiesFromCommunity);
router.get('commodities/categories/:id', commodity_controller_1.CommodityController.getCommoditiesFromCategory);
router.get('commodities/:id', commodity_controller_1.CommodityController.getCommodityDetail);
router.post('admin_commodities', commodity_controller_1.CommodityController.adminCreateCommodity);
router.get('admin_commodities/communities/:id', commodity_controller_1.CommodityController.adminGetCommoditiesFromCommunity);
router.put('admin_commodities/:id', commodity_controller_1.CommodityController.adminUpdateCommodity);
router.del('admin_commodities/:id', commodity_controller_1.CommodityController.adminDeleteCommodity);
exports.commodityRouter = router;
//# sourceMappingURL=commodity.router.js.map