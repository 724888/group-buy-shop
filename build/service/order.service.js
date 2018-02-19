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
const order_model_1 = require("../model/order.model");
const utils_service_1 = require("./utils.service");
const commodity_service_1 = require("./commodity.service");
const createHttpError = require("http-errors");
const config_dev_1 = require("../config/config.dev");
const group_service_1 = require("./group.service");
const nodeWeixinPay = require('node-weixin-pay');
class OrderService {
    static checkIfOrderRequestCanPass(o) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commodity = yield commodity_service_1.CommodityService.getCommodityFromId(o.commodityId);
                return !(o.quantity <= 0 || commodity.stock - o.quantity < 0 || commodity.status === 0 || !('groupId' in commodity)
                    || commodity.groupId.status !== 0 ||
                    commodity.groupId.group_attach + o.quantity > commodity.groupId.group_goal
                    || Date.now() > new Date(commodity.groupId.group_time).getTime());
            }
            catch (err) {
                console.log(__dirname + __filename);
                console.log(err);
                return false;
            }
        });
    }
    static getOrdersFromTradeNo(out_trade_no, user, commodityId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user) {
                if (commodityId) {
                    return yield order_model_1.Order.find({ out_trade_no: out_trade_no, userId: user._id, commodityId: commodityId }, {
                        commodityId: 1,
                        quantity: 1,
                        spec: 1,
                        payment: 1,
                        pick_time: 1,
                        pick_address: 1,
                        pick_code: 1
                    })
                        .populate('commodityId ', { name: 1, bannerIds: 1 });
                }
                else {
                    return yield order_model_1.Order.find({ out_trade_no: out_trade_no, userId: user._id }, {
                        commodityId: 1,
                        quantity: 1,
                        spec: 1,
                        payment: 1,
                        pick_time: 1,
                        pick_address: 1,
                        pick_code: 1
                    })
                        .populate('commodityId ', { name: 1, bannerIds: 1 });
                }
            }
            else {
                if (commodityId) {
                    return yield order_model_1.Order.find({ out_trade_no: out_trade_no, commodityId: commodityId })
                        .populate('commodityId', { name: 1 });
                }
                else {
                    return yield order_model_1.Order.find({ out_trade_no: out_trade_no })
                        .populate('commodityId', { name: 1 });
                }
            }
        });
    }
    static saveOrderFromRequest(reqUser, orderRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const out_trade_no = utils_service_1.UtilsService.genRandomString(16, String(Date.now()));
            let orders = [];
            for (let o of orderRequest) {
                const res = yield OrderService.checkIfOrderRequestCanPass(o);
                if (res) {
                    const order = new order_model_1.Order({
                        userId: reqUser._id,
                        commodityId: o.commodityId,
                        quantity: o.quantity,
                        out_trade_no: out_trade_no,
                        spec: o.spec,
                    });
                    orders.push(order);
                }
                else {
                    throw createHttpError(400, '订单提交失败');
                }
            }
            for (let index in orders) {
                orders.splice(Number(index), 1, yield orders[index].save());
            }
            return orders;
        });
    }
    static genMakeOrderBody(orders) {
        const perfix = config_dev_1.settings.body_prefix;
        if (orders.length > 1) {
            return `${perfix}-多个商品`;
        }
        else {
            return `${perfix}-单个商品`;
        }
    }
    static orderRefund(orders) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                orders.forEach((o) => __awaiter(this, void 0, void 0, function* () {
                    let out_refund_no;
                    if (!o.out_refund_no) {
                        out_refund_no = utils_service_1.UtilsService.genRandomString(4, String(Date.now()));
                    }
                    else {
                        out_refund_no = o.out_refund_no;
                    }
                    const params = {
                        appid: config_dev_1.settings.appid,
                        mch_id: config_dev_1.settings.mch_id,
                        nonce_str: utils_service_1.UtilsService.genRandomString(32),
                        transaction_id: o.transaction_id,
                        out_trade_no: o.out_trade_no,
                        out_refund_no: out_refund_no,
                        total_fee: o.payment,
                        refund_fee: o.payment,
                        op_user_id: config_dev_1.settings.mch_id
                    };
                    yield nodeWeixinPay.api.refund.create(config_dev_1.config, params, function (error, data, json) {
                        return __awaiter(this, void 0, void 0, function* () {
                            if (json.result_code === 'SUCCESS') {
                                resolve(yield order_model_1.Order.findOneAndUpdate({ _id: o._id }, { status: 4, out_refund_no: json.out_refund_no, refund_id: json.refund_id }, { new: true }));
                            }
                            else {
                                reject({ status: false, msg: json.err_code_des });
                            }
                        });
                    });
                }));
            });
        });
    }
    static paySuccess(out_trade_no, transaction_id) {
        return __awaiter(this, void 0, void 0, function* () {
            order_model_1.Order.find({ out_trade_no: out_trade_no, is_notify: false })
                .then(orders => {
                orders.forEach((o) => __awaiter(this, void 0, void 0, function* () {
                    const { status, group, commodity } = yield group_service_1.GroupService.payAndCheckGroupIfSuccess(o, transaction_id);
                    switch (status) {
                        case 1: {
                            yield group_service_1.GroupService.groupSuccess(group, commodity);
                            break;
                        }
                        case 0: {
                            yield group_service_1.GroupService.groupProcessing(group);
                            break;
                        }
                        case -1: {
                            yield OrderService.orderRefund([o]);
                            break;
                        }
                    }
                }));
            });
        });
    }
    static getOrdersFromUser(user, query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (query.status) {
                return yield order_model_1.Order.find({ userId: user._id, status: query.status }, {
                    commodityId: 1,
                    quantity: 1,
                    spec: 1,
                    payment: 1,
                    pick_time: 1,
                    pick_address: 1,
                    pick_code: 1
                })
                    .populate('commodityId ', { name: 1, bannerIds: 1 });
            }
            else {
                return yield order_model_1.Order.find({ userId: user._id, status: { $ne: 0 } }, {
                    commodityId: 1,
                    quantity: 1,
                    spec: 1,
                    payment: 1,
                    pick_time: 1,
                    pick_address: 1,
                    pick_code: 1
                })
                    .populate('commodityId ', { name: 1, bannerIds: 1 });
            }
        });
    }
    static getOrdersFromGroup(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield order_model_1.Order.find({ groupId: groupId, status: { $ne: 0 } })
                .populate('userId commodityId');
        });
    }
}
exports.OrderService = OrderService;
//# sourceMappingURL=order.service.js.map