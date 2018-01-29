import * as Router from "koa-router";

import {AuthController} from "../controller/auth.controller";

const router = new Router();

router.post('code', AuthController.getOpenid);

router.post('signup', AuthController.completeInformation);

export const authRouter = router;