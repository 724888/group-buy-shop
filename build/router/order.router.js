"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const order_controller_1 = require("../controller/order.controller");
const router = new Router();
router.post('orders', order_controller_1.OrderController.createOrder);
router.post('orders/notify', order_controller_1.OrderController.orderNotify);
exports.orderRouter = router;
//# sourceMappingURL=order.router.js.map