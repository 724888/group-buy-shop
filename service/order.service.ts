import {IOrder, Order} from "../model/order.model";

import {UtilsService} from "./utils.service";

import {CommodityService} from "./commodity.service";

import {Group, IGroup} from "../model/group.model";

import {IUser} from "../model/user.model";

import * as createHttpError from "http-errors";

import {settings, config} from "../config/config.dev";

import {GroupService} from "./group.service";
import {Commodity, ICommodity} from "../model/commodity.model";

const nodeWeixinPay = require('node-weixin-pay');

export interface makeOrderRequest {
    commodityId: string;
    quantity: number;
    spec?: string;
}

export class OrderService {
    static async checkIfOrderRequestCanPass(o: makeOrderRequest): Promise<boolean> {
        try {
            const commodity = await CommodityService.getCommodityFromId(o.commodityId);
            return !(o.quantity <= 0 || commodity.stock - o.quantity < 0 || commodity.status === 0 || !('groupId' in commodity)
                || (commodity.groupId as IGroup).status !== 0 ||
                (commodity.groupId as IGroup).group_attach + o.quantity > (commodity.groupId as IGroup).group_goal
                || Date.now() > new Date((commodity.groupId as IGroup).group_time).getTime());
        } catch (err) {
            console.log(__dirname + __filename);
            console.log(err);
            return false
        }
    }

    static async getOrdersFromTradeNo(out_trade_no: string, user?: IUser, commodityId?: string): Promise<Array<IOrder>> {
        if (user) {
            if (commodityId) {
                return await Order.find({out_trade_no: out_trade_no, userId: user._id, commodityId: commodityId}, {
                    commodityId: 1,
                    quantity: 1,
                    spec: 1,
                    payment: 1,
                    pick_time: 1,
                    pick_address: 1,
                    pick_code: 1
                })
                    .populate('commodityId ', {name: 1, bannerIds: 1})
            } else {
                return await Order.find({out_trade_no: out_trade_no, userId: user._id}, {
                    commodityId: 1,
                    quantity: 1,
                    spec: 1,
                    payment: 1,
                    pick_time: 1,
                    pick_address: 1,
                    pick_code: 1
                })
                    .populate('commodityId ', {name: 1, bannerIds: 1})
            }
        } else {
            if (commodityId) {
                return await Order.find({out_trade_no: out_trade_no, commodityId: commodityId})
                    .populate('commodityId', {name: 1})
            } else {
                return await Order.find({out_trade_no: out_trade_no})
                    .populate('commodityId', {name: 1})
            }
        }
    }

    static async saveOrderFromRequest(reqUser: IUser, orderRequest: makeOrderRequest[]): Promise<Array<IOrder>> {
        const out_trade_no = UtilsService.genRandomString(16, String(Date.now()));
        let orders = [];
        for (let o of orderRequest) {
            const res = await OrderService.checkIfOrderRequestCanPass(o);
            if (res) {
                const order = new Order({
                    userId: reqUser._id,
                    commodityId: o.commodityId,
                    quantity: o.quantity,
                    out_trade_no: out_trade_no,
                    spec: o.spec,
                });
                orders.push(order);
            } else {
                throw createHttpError(400, '订单提交失败');
            }
        }
        for (let index in orders) {
            orders.splice(Number(index), 1, await orders[index].save())
        }
        return orders;
    }

    static genMakeOrderBody(orders: IOrder[]): string {
        const perfix = settings.body_prefix;
        if (orders.length > 1) {
            return `${perfix}-多个商品`
        } else {
            return `${perfix}-单个商品`
        }
    }

    static async orderRefund(orders: IOrder[]) {
        return new Promise((resolve, reject) => {
            orders.forEach(async (o) => {
                let out_refund_no;
                if (!o.out_refund_no) {
                    out_refund_no = UtilsService.genRandomString(4, String(Date.now()));
                } else {
                    out_refund_no = o.out_refund_no;
                }
                const params = {
                    appid: settings.appid,
                    mch_id: settings.mch_id,
                    nonce_str: UtilsService.genRandomString(32),
                    transaction_id: o.transaction_id,
                    out_trade_no: o.out_trade_no,
                    out_refund_no: out_refund_no,
                    total_fee: o.payment,
                    refund_fee: o.payment,
                    op_user_id: settings.mch_id
                };
                await nodeWeixinPay.api.refund.create(config, params, async function (error, data, json) {
                    if (json.result_code === 'SUCCESS') {
                        const c = await Commodity.findOne({_id: (o.commodityId as ICommodity)._id});
                        const g = await Group.findOne({_id: o.groupId});
                        await g.update({
                            group_attach: g.group_attach - o.quantity
                        });
                        await c.update({
                            stock: c.stock + o.quantity,
                            sales: c.stock - o.quantity
                        });
                        resolve(await Order.findOneAndUpdate({_id: o._id}, {status: 4, out_refund_no: json.out_refund_no, refund_id: json.refund_id}, {new: true}))
                    } else {
                        reject({status: false, msg: json.err_code_des})
                    }
                });
            });
        })
    }

    static async paySuccess(out_trade_no: string, transaction_id: string) {
        Order.find({out_trade_no: out_trade_no, is_notify: false})
            .then(orders => {
                orders.forEach(async (o) => {
                    const {status, group, commodity} = await GroupService.payAndCheckGroupIfSuccess(o, transaction_id);
                    switch (status) {
                        case 1: {
                            await GroupService.groupSuccess(group, commodity);
                            break;
                        }
                        case 0: {
                            await GroupService.groupProcessing(group);
                            break;
                        }
                        case -1: {
                            await OrderService.orderRefund([o]);
                            break;
                        }
                    }
                })
            })
    }

    static async getOrdersFromUser(user: IUser, query): Promise<Array<IOrder>> {
        if (query.status) {
            return await Order.find({userId: user._id, status: query.status}, {
                commodityId: 1,
                quantity: 1,
                spec: 1,
                payment: 1,
                pick_time: 1,
                pick_address: 1,
                pick_code: 1
            })
                .populate('commodityId ', {name: 1, bannerIds: 1})
        } else {
            return await Order.find({userId: user._id, status: {$ne: 0}}, {
                commodityId: 1,
                quantity: 1,
                spec: 1,
                payment: 1,
                pick_time: 1,
                pick_address: 1,
                pick_code: 1
            })
                .populate('commodityId ', {name: 1, bannerIds: 1})
        }
    }

    static async getOrdersFromGroup(groupId: string): Promise<Array<IOrder>> {
        return await Order.find({groupId: groupId, status: {$ne: 0}})
            .populate('userId commodityId')
    }
}