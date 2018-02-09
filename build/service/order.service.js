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
    static paySuccess(out_trade_no, transaction_id) {
        return __awaiter(this, void 0, void 0, function* () {
            order_model_1.Order.find({ out_trade_no: out_trade_no, is_notify: false })
                .then(orders => {
                orders.forEach((o) => __awaiter(this, void 0, void 0, function* () {
                    const { status, group } = yield group_service_1.GroupService.payAndCheckGroupIfSuccess(o.groupId, o.quantity);
                    switch (status) {
                        case 1: {
                            yield group_service_1.GroupService.groupSuccess(group);
                            break;
                        }
                        case 0: {
                            break;
                        }
                        case -1: {
                            break;
                        }
                    }
                }));
            });
        });
    }
}
exports.OrderService = OrderService;
//# sourceMappingURL=order.service.js.map