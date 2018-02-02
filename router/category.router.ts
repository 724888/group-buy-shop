import * as Router from "koa-router";

import {CategoryController} from "../controller/category.controller";

const router = new Router();


// For Administrators

router.post('admin_categories', CategoryController.adminCreateCategory);

router.get('admin_categories', CategoryController.adminGetCategories);

router.get('admin_categories/communities/:id', CategoryController.adminGetCategoriesFromCommunity);

router.put('admin_categories/:id', CategoryController.adminUpdateCategory);

router.del('admin_categories/:id', CategoryController.adminDeleteCategory);

export const categoryRouter = router;