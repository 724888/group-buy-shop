import * as Router from "koa-router";

import {AuthController} from "../controller/auth.controller";

const router = new Router();

router.post('code', AuthController.getOpenid);

router.post('signup', AuthController.completeInformation);


// For Administrators

router.post('login', AuthController.adminLogin);

router.get('admin_user', AuthController.adminGetAdminUser);

router.get('admin_user/:id', AuthController.adminGetUser);

export const authRouter = router;