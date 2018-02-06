import {Category, ICategory} from "../model/category.model";

import {Community, ICommunity} from "../model/community.model";

import {IUser} from "../model/user.model";

import {AuthService} from "./auth.service";

import * as createHttpError from "http-errors";
import {Commodity} from "../model/commodity.model";

export class CategoryService {
    static async getCategories(): Promise<Array<ICategory>> {
        return await Category.find();
    }

    static async getCategoryFromId(id: string): Promise<ICategory> {
        try {
            return await Category.findOne({_id: id})
        } catch (err) {
            throw createHttpError(400, '无效的分类id')
        }
    }

    static async getCategoriesFromCommunity(community: ICommunity): Promise<Array<ICategory>> {
        return await Category.find({_id: {$in: community.categoryIds}});
    }

    static async getCategoriesFromAdminUser(user: IUser): Promise<Array<ICategory>> {
        const community = await Community.findOne({userId: user._id});
        return await CategoryService.getCategoriesFromCommunity(community);
    }

    static async saveCategory(user: IUser, name: string, type: number, communityId: string, parentId?: string): Promise<ICategory> {
        if (AuthService.checkIfAdminUser(user)) {
            let category;
            if (type === 1) {
                category = new Category({
                    name: name,
                    type: type
                });
            } else {
                category = new Category({
                    name: name,
                    type: type,
                    parentCategory: parentId
                });
            }
            await Community.update({_id: communityId}, {$push: {categoryIds: category._id}});
            return await category.save()
        }
    }

    static async updateCategory(user: IUser, id: string, name: string): Promise<ICategory> {
        if (AuthService.checkIfAdminUser(user)) {
            return await Category.findOneAndUpdate({_id: id}, {name: name}, {new: true})
        }
    }

    static async deleteCategory(id: string): Promise<boolean> {
        try {
            const category = await Category.findOneAndRemove({_id: id});
            if (category.type === 1) {
                await Commodity.remove({categoryId: category._id});
                const child = await Category.find({parentCategory: category._id});
                child.forEach(async(c) => {
                    await Commodity.remove({categoryId: c._id})
                });
                return true
            } else {
                await Commodity.remove({categoryId: category._id});
                return true
            }
        } catch (err) {
            return false
        }
    }
}