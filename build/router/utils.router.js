"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const utils_controller_1 = require("../controller/utils.controller");
const router = new Router();
router.post('admin_upload', utils_controller_1.UtilsController.adminUploadImg);
exports.utilsRouter = router;
//# sourceMappingURL=utils.router.js.map