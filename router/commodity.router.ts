import * as Router from "koa-router";

import {CommodityController} from "../controller/commodity.controller";

const router = new Router();

router.get('commodities/communities/:id', CommodityController.getCommoditiesFromCommunity);

router.get('commodities/categories/:id', CommodityController.getCommoditiesFromCategory);

router.get('commodities/:id', CommodityController.getCommodityDetail);


// For Administrators

router.post('admin_commodities', CommodityController.adminCreateCommodity);

router.get('admin_commodities/communities/:id', CommodityController.adminGetCommoditiesFromCommunity);

router.put('admin_commodities/:id', CommodityController.adminUpdateCommodity);

router.del('admin_commodities/:id', CommodityController.adminDeleteCommodity);

export const commodityRouter = router;