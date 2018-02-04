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
const commodity_model_1 = require("../model/commodity.model");
class CommodityService {
    static saveCommodity(name, bannerIds, communityId, categoryId, price, stock, specs, content, is_hot, is_commend) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = new commodity_model_1.Commodity({
                name: name,
                bannerIds: bannerIds,
                communityId: communityId,
                categoryId: categoryId,
                price: price,
                stock: stock,
                specs: specs,
                content: content,
                is_hot: is_hot,
                is_commend: is_commend
            });
            return yield c.save();
        });
    }
}
exports.CommodityService = CommodityService;
//# sourceMappingURL=commodity.service.js.map