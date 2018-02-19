import {makeOrderRequest, OrderService} from "../service/order.service";

import {AuthService} from "../service/auth.service";

import {app, config, merchant, settings} from "../config/config.dev";

import {UtilsService} from "../service/utils.service";

import * as Bluebird from "bluebird";

import * as createHttpError from "http-errors";

import * as getRawBody from "raw-body";

const nodeWeixinPay = require('node-weixin-pay');


export class OrderController {
    static async createOrder(ctx, next) {
        const makeOrderReq = ctx.request.body as makeOrderRequest[];
        const user = await AuthService.getUserFromId(ctx.state.user._id);
        const orders = await OrderService.saveOrderFromRequest(user, makeOrderReq);
        let total_fee = 0;
        orders.forEach(o => total_fee = total_fee + o.payment);
        const params = {
            openid: user.openid,
            spbill_create_ip: '127.0.0.1',
            notify_url: settings.notify_url,
            body: OrderService.genMakeOrderBody(orders),
            out_trade_no: orders[0].out_trade_no,
            total_fee: total_fee,
            trade_type: 'JSAPI',
            appid: settings.appid,
            mch_id: settings.mch_id,
            nonce_str: UtilsService.genRandomString(32)
        };
        const getPrepayInfoAsync = Bluebird.promisify<any, any, any>(nodeWeixinPay.api.order.unified);
        await getPrepayInfoAsync(config, params)
            .then(data => {
                const prepay_id = data.prepay_id;
                const prepayinfo = nodeWeixinPay.prepay(app, merchant, prepay_id);
                prepayinfo.out_trade_no = orders[0].out_trade_no;
                ctx.body = prepayinfo;
            })
            .catch(err => {
                console.log(err);
                throw createHttpError(400, '订单提交失败');
            })
    }

    static async orderNotify(ctx, next) {
        const options = Object.assign({
            limit: '1mb',
            encoding: 'utf8',
            xmlOptions: {}
        }, {});
        const rawXml = await getRawBody(ctx.req, options);
        const req = {
            rawBody: rawXml
        };
        let res = ctx.response;
        res.send = function (value) {
            res.body = value
        };
        nodeWeixinPay.callback.notify(app, merchant, req, res, async (err, result, json) => {
            const notifyData = json.xml;
            if (notifyData.result_code === 'SUCCESS') {
                await OrderService.paySuccess(result.out_trade_no, notifyData.transaction_id);
            }
        })
    }

    static async getOrderDetail(ctx, next) {
        const user = await AuthService.getUserFormHeaderToken(ctx);
        ctx.body = await OrderService.getOrdersFromTradeNo(ctx.params.out_trade_no, user)
    }

    static async getCustomerOrders(ctx, next) {
        const user = await AuthService.getUserFormHeaderToken(ctx);
        ctx.body = await OrderService.getOrdersFromUser(user, ctx.request.query);
    }

    static async getCommodityOrderDetail(ctx, next) {
        const user = await AuthService.getUserFormHeaderToken(ctx);
        ctx.body = await OrderService.getOrdersFromTradeNo(ctx.params.out_trade_no, user, ctx.params.commodityId);
    }

    static async getOrdersFromGroup(ctx, next) {
        ctx.body = await OrderService.getOrdersFromGroup(ctx.params.id);
    }

    static async refundOrder(ctx, next) {
        const {out_trade_no, commodityId} = ctx.request.body;
        const orders = await OrderService.getOrdersFromTradeNo(out_trade_no, ctx.state.user, commodityId);
        try {
            ctx.body = await OrderService.orderRefund(orders);
        }
         catch (err) {
            throw createHttpError(500, err)
        }
    }

    static async adminRefundOrder(ctx, next) {
        const {out_trade_no, commodityId} = ctx.request.body;
        const orders = await OrderService.getOrdersFromTradeNo(out_trade_no, null, commodityId);
        await OrderService.orderRefund(orders)
            .then(data => {
                ctx.body = data
            })
            .catch(err => {
                throw createHttpError(400, err.msg)
            })
    }


}