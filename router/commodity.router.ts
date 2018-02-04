import * as Router from "koa-router";

import {CommodityController} from "../controller/commodity.controller";

const router = new Router();

router.post('admin_commodities', CommodityController.adminCreateCommodity);

export const commodityRouter = router;