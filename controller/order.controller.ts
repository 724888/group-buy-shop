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
        nodeWeixinPay.callback.notify(app, merchant, req, res, (err, result, json) => {
            const notifyData = json.xml;
            console.log(notifyData, err, result);
            if (notifyData.result_code === 'SUCCESS') {
                OrderService.paySuccess(result.out_trade_no, notifyData.transaction_id);
                // Order.find({out_trade_no: result.out_trade_no, is_notify: false})
                //     .then(orders => {
                //         orders.forEach(async (o) => {
                //             await o.update({status: 1, transaction_id: notifyData.transaction_id, is_notify: true});
                //             const commodity = await Commodity.findOne({_id: o.commodityId});
                //             const group = await Group.findOne({_id: commodity.groupId});
                //             await commodity.update({
                //                 stock: commodity.stock - o.quantity,
                //                 sales: commodity.sales + o.quantity,
                //             });
                //             if (group.group_attach + o.quantity === group.group_goal) {
                //                 await group.update({group_attach: group.group_attach + o.quantity, status: 1});
                //                 await commodity.update({$unset: {groupId: ''}, is_activate: false});
                //                 GroupController.genPickCode(group._id);
                //             } else {
                //                 await group.update({group_attach: group.group_attach + o.quantity});
                //             }
                //             // wss.broadcast(JSON.stringify({
                //             //     group_attach: commodity.group_attach + o.quantity,
                //             //     group_goal: commodity.group_goal
                //             // }));
                //         })
                //     })
            }
        })
    }
}