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
const category_model_1 = require("../model/category.model");
const community_model_1 = require("../model/community.model");
const auth_service_1 = require("./auth.service");
const createHttpError = require("http-errors");
const commodity_model_1 = require("../model/commodity.model");
class CategoryService {
    static getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield category_model_1.Category.find();
        });
    }
    static getCategoryFromId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield category_model_1.Category.findOne({ _id: id });
            }
            catch (err) {
                throw createHttpError(400, '无效的分类id');
            }
        });
    }
    static getCategoriesFromCommunity(community) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield category_model_1.Category.find({ _id: { $in: community.categoryIds } });
        });
    }
    static getCategoriesFromAdminUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const community = yield community_model_1.Community.findOne({ userId: user._id });
            return yield CategoryService.getCategoriesFromCommunity(community);
        });
    }
    static saveCategory(user, name, type, communityId, parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (auth_service_1.AuthService.checkIfAdminUser(user)) {
                let category;
                if (type === 1) {
                    category = new category_model_1.Category({
                        name: name,
                        type: type
                    });
                }
                else {
                    category = new category_model_1.Category({
                        name: name,
                        type: type,
                        parentCategory: parentId
                    });
                }
                yield community_model_1.Community.update({ _id: communityId }, { $push: { categoryIds: category._id } });
                return yield category.save();
            }
        });
    }
    static updateCategory(user, id, name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (auth_service_1.AuthService.checkIfAdminUser(user)) {
                return yield category_model_1.Category.findOneAndUpdate({ _id: id }, { name: name }, { new: true });
            }
        });
    }
    static deleteCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield category_model_1.Category.findOneAndRemove({ _id: id });
                if (category.type === 1) {
                    yield commodity_model_1.Commodity.remove({ categoryId: category._id });
                    const child = yield category_model_1.Category.find({ parentCategory: category._id });
                    child.forEach((c) => __awaiter(this, void 0, void 0, function* () {
                        yield commodity_model_1.Commodity.remove({ categoryId: c._id });
                    }));
                    return true;
                }
                else {
                    yield commodity_model_1.Commodity.remove({ categoryId: category._id });
                    return true;
                }
            }
            catch (err) {
                return false;
            }
        });
    }
}
exports.CategoryService = CategoryService;
//# sourceMappingURL=category.service.js.map