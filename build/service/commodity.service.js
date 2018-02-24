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
const banner_model_1 = require("../model/banner.model");
const _ = require("lodash");
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
    static getCommodityFromId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield commodity_model_1.Commodity.findOne({ _id: id })
                .populate('categoryId groupId bannerIds');
        });
    }
    static updateCommodity(id, name, bannerIds, communityId, categoryId, price, stock, specs, content, is_hot, is_commend) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield commodity_model_1.Commodity.findOneAndUpdate({ _id: id }, {
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
            }, { new: true });
        });
    }
    static getCommoditiesFromCommunity(id, user = false, query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user) {
                if (query) {
                    query.communityId = id;
                    query.status = { $ne: 0 };
                    const filterQuery = _.pick(query, ['is_commend', 'is_hot', 'communityId', 'status']);
                    return yield commodity_model_1.Commodity.find(filterQuery, { content: 0, specs: 0, communityId: 0, status: 0, meta: 0 })
                        .populate('bannerIds groupId categoryId');
                }
            }
            else {
                return yield commodity_model_1.Commodity.find({ communityId: id })
                    .populate('bannerIds');
            }
        });
    }
    static getCommoditiesFromCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield commodity_model_1.Commodity.find({ categoryId: id, status: { $ne: 0 } }, { content: 0, specs: 0, communityId: 0, status: 0, meta: 0 })
                .populate('communityId categoryId bannerIds groupId');
        });
    }
    static deleteCommodity(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const c = yield commodity_model_1.Commodity.findOneAndRemove({ _id: id });
                yield banner_model_1.Banner.remove({ _id: { $in: c.bannerIds } });
                return true;
            }
            catch (err) {
                return false;
            }
        });
    }
}
exports.CommodityService = CommodityService;
//# sourceMappingURL=commodity.service.js.map