import {IOrder, Order} from "../model/order.model";

import {UtilsService} from "./utils.service";

import {CommodityService} from "./commodity.service";

import {IGroup} from "../model/group.model";

import {IUser} from "../model/user.model";

import * as createHttpError from "http-errors";

import {settings} from "../config/config.dev";

import {GroupService} from "./group.service";

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

    static async paySuccess(out_trade_no: string, transaction_id: string) {
        Order.find({out_trade_no: out_trade_no, is_notify: false})
            .then(orders => {
                orders.forEach(async (o) => {
                    const {status, group} = await GroupService.payAndCheckGroupIfSuccess(o.groupId as string, o.quantity);
                    switch (status) {
                        case 1: {
                            await GroupService.groupSuccess(group);
                            break;
                        }
                        case 0: {
                            break;
                        }
                        case -1: {
                            break;
                        }
                    }
                })
            })
    }
}