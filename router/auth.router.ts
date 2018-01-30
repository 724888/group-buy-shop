import * as Router from "koa-router";

import {AuthController} from "../controller/auth.controller";

const router = new Router();

router.post('code', AuthController.getOpenid);

router.post('signup', AuthController.completeInformation);



router.post('admin_login', AuthController.adminLogin);

router.get('admin_user', AuthController.getAdminUser);

export const authRouter = router;