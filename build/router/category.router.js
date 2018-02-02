"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const category_controller_1 = require("../controller/category.controller");
const router = new Router();
router.post('admin_categories', category_controller_1.CategoryController.adminCreateCategory);
router.get('admin_categories', category_controller_1.CategoryController.adminGetCategories);
router.get('admin_categories/communities/:id', category_controller_1.CategoryController.adminGetCategoriesFromCommunity);
router.put('admin_categories/:id', category_controller_1.CategoryController.adminUpdateCategory);
router.del('admin_categories/:id', category_controller_1.CategoryController.adminDeleteCategory);
exports.categoryRouter = router;
//# sourceMappingURL=category.router.js.map