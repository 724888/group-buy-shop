"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const auth_controller_1 = require("../controller/auth.controller");
const router = new Router();
router.post('code', auth_controller_1.AuthController.getOpenid);
router.post('signup', auth_controller_1.AuthController.completeInformation);
router.post('admin_login', auth_controller_1.AuthController.adminLogin);
router.get('admin_user', auth_controller_1.AuthController.getAdminUser);
exports.authRouter = router;
//# sourceMappingURL=auth.router.js.map