import {AuthService} from "../service/auth.service";

import {CategoryService} from "../service/category.service";

import {CommunityService} from "../service/community.service";

import * as createHttpError from "http-errors";

export class CategoryController {
    static async adminCreateCategory(ctx, next) {
        const {name, type, communityId, parentId} = ctx.request.body;
        ctx.body = await CategoryService.saveCategory(ctx.state.user, name, type, communityId, parentId)
    }

    static async adminGetCategories(ctx, next) {
        const user = await AuthService.adminGetuserFromHeaderToken(ctx);
        if (user.usertype === 1) {
            ctx.body = await CategoryService.getCategories()
        } else {
            ctx.body = await CategoryService.getCategoriesFromAdminUser(user)
        }
    }

    static async adminGetCategoriesFromCommunity(ctx, next) {
        const user = await AuthService.adminGetuserFromHeaderToken(ctx);
        if (AuthService.checkIfAdminUser(user)) {
            const community = await CommunityService.getCommunityFromId(ctx.params.id);
            ctx.body = await CategoryService.getCategoriesFromCommunity(community);
        }
    }

    static async adminUpdateCategory(ctx, next) {
        const {name} = ctx.request.body;
        ctx.body = await CategoryService.updateCategory(ctx.state.user, ctx.params.id, name)
    }

    static async adminDeleteCategory(ctx, next) {
        if (AuthService.checkIfAdminUser(ctx.state.user)) {
            const res = await CategoryService.deleteCategory(ctx.params.id);
            if (res) {
                ctx.status = 204
            } else{
                throw createHttpError(400, '删除该分类失败')
            }
        }
    }
}