import * as Router from "koa-router";

import {OrderController} from "../controller/order.controller";

const router = new Router();

router.post('orders', OrderController.createOrder);

router.post('orders/notify', OrderController.orderNotify);

export const orderRouter = router;