"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_service_1 = require("../service/order.service");
const auth_service_1 = require("../service/auth.service");
const config_dev_1 = require("../config/config.dev");
const utils_service_1 = require("../service/utils.service");
const Bluebird = require("bluebird");
const createHttpError = require("http-errors");
const getRawBody = require("raw-body");
const nodeWeixinPay = require('node-weixin-pay');
class OrderController {
    static createOrder(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const makeOrderReq = ctx.request.body;
            const user = yield auth_service_1.AuthService.getUserFromId(ctx.state.user._id);
            const orders = yield order_service_1.OrderService.saveOrderFromRequest(user, makeOrderReq);
            let total_fee = 0;
            orders.forEach(o => total_fee = total_fee + o.payment);
            const params = {
                openid: user.openid,
                spbill_create_ip: '127.0.0.1',
                notify_url: config_dev_1.settings.notify_url,
                body: order_service_1.OrderService.genMakeOrderBody(orders),
                out_trade_no: orders[0].out_trade_no,
                total_fee: total_fee,
                trade_type: 'JSAPI',
                appid: config_dev_1.settings.appid,
                mch_id: config_dev_1.settings.mch_id,
                nonce_str: utils_service_1.UtilsService.genRandomString(32)
            };
            const getPrepayInfoAsync = Bluebird.promisify(nodeWeixinPay.api.order.unified);
            yield getPrepayInfoAsync(config_dev_1.config, params)
                .then(data => {
                const prepay_id = data.prepay_id;
                const prepayinfo = nodeWeixinPay.prepay(config_dev_1.app, config_dev_1.merchant, prepay_id);
                prepayinfo.out_trade_no = orders[0].out_trade_no;
                ctx.body = prepayinfo;
            })
                .catch(err => {
                console.log(err);
                throw createHttpError(400, '订单提交失败');
            });
        });
    }
    static orderNotify(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = Object.assign({
                limit: '1mb',
                encoding: 'utf8',
                xmlOptions: {}
            }, {});
            const rawXml = yield getRawBody(ctx.req, options);
            const req = {
                rawBody: rawXml
            };
            let res = ctx.response;
            res.send = function (value) {
                res.body = value;
            };
            nodeWeixinPay.callback.notify(config_dev_1.app, config_dev_1.merchant, req, res, (err, result, json) => __awaiter(this, void 0, void 0, function* () {
                const notifyData = json.xml;
                if (notifyData.result_code === 'SUCCESS') {
                    yield order_service_1.OrderService.paySuccess(result.out_trade_no, notifyData.transaction_id);
                }
            }));
        });
    }
    static getOrderDetail(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield auth_service_1.AuthService.getUserFormHeaderToken(ctx);
            ctx.body = yield order_service_1.OrderService.getOrdersFromTradeNo(ctx.params.out_trade_no, user);
        });
    }
    static getCustomerOrders(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield auth_service_1.AuthService.getUserFormHeaderToken(ctx);
            ctx.body = yield order_service_1.OrderService.getOrdersFromUser(user, ctx.request.query);
        });
    }
    static getCommodityOrderDetail(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield auth_service_1.AuthService.getUserFormHeaderToken(ctx);
            ctx.body = yield order_service_1.OrderService.getOrdersFromTradeNo(ctx.params.out_trade_no, user, ctx.params.commodityId);
        });
    }
    static getOrdersFromGroup(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            ctx.body = yield order_service_1.OrderService.getOrdersFromGroup(ctx.params.id);
        });
    }
    static refundOrder(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { out_trade_no, commodityId } = ctx.request.body;
            const orders = yield order_service_1.OrderService.getOrdersFromTradeNo(out_trade_no, ctx.state.user, commodityId);
            try {
                ctx.body = yield order_service_1.OrderService.orderRefund(orders);
            }
            catch (err) {
                throw createHttpError(500, err);
            }
        });
    }
    static adminRefundOrder(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { out_trade_no, commodityId } = ctx.request.body;
            const orders = yield order_service_1.OrderService.getOrdersFromTradeNo(out_trade_no, null, commodityId);
            yield order_service_1.OrderService.orderRefund(orders)
                .then(data => {
                ctx.body = data;
            })
                .catch(err => {
                throw createHttpError(400, err.msg);
            });
        });
    }
}
exports.OrderController = OrderController;
//# sourceMappingURL=order.controller.js.map