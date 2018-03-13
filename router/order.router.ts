import * as Router from "koa-router";

import {OrderController} from "../controller/order.controller";

const router = new Router();

router.post('orders', OrderController.createOrder);

router.post('orders/notify', OrderController.orderNotify);

router.get('orders/customer', OrderController.getCustomerOrders);

router.get('orders/:out_trade_no', OrderController.getOrderDetail);

router.get('orders/:out_trade_no/commodity/:commodityId', OrderController.getCommodityOrderDetail);

router.post('orders/refund', OrderController.refundOrder);

router.post('orders/pickup', OrderController.orderPickup);




// For Administrators

router.get('admin_orders/group/:id', OrderController.getOrdersFromGroup);

router.post('admin_orders/refund', OrderController.adminRefundOrder);

export const orderRouter = router;