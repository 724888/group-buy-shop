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
const auth_service_1 = require("../service/auth.service");
const category_service_1 = require("../service/category.service");
const community_service_1 = require("../service/community.service");
const createHttpError = require("http-errors");
class CategoryController {
    static adminCreateCategory(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, type, communityId, parentId } = ctx.request.body;
            ctx.body = yield category_service_1.CategoryService.saveCategory(ctx.state.user, name, type, communityId, parentId);
        });
    }
    static adminGetCategories(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield auth_service_1.AuthService.adminGetuserFromHeaderToken(ctx);
            if (user.usertype === 1) {
                ctx.body = yield category_service_1.CategoryService.getCategories();
            }
            else {
                ctx.body = yield category_service_1.CategoryService.getCategoriesFromAdminUser(user);
            }
        });
    }
    static adminGetCategoriesFromCommunity(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield auth_service_1.AuthService.adminGetuserFromHeaderToken(ctx);
            if (auth_service_1.AuthService.checkIfAdminUser(user)) {
                const community = yield community_service_1.CommunityService.getCommunityFromId(ctx.params.id);
                ctx.body = yield category_service_1.CategoryService.getCategoriesFromCommunity(community);
            }
        });
    }
    static adminUpdateCategory(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = ctx.request.body;
            ctx.body = yield category_service_1.CategoryService.updateCategory(ctx.state.user, ctx.params.id, name);
        });
    }
    static adminDeleteCategory(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (auth_service_1.AuthService.checkIfAdminUser(ctx.state.user)) {
                const res = yield category_service_1.CategoryService.deleteCategory(ctx.params.id);
                if (res) {
                    ctx.status = 204;
                }
                else {
                    throw createHttpError(400, '删除该分类失败');
                }
            }
        });
    }
}
exports.CategoryController = CategoryController;
//# sourceMappingURL=category.controller.js.map