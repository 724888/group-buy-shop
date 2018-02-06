import * as Router from "koa-router";

import {UtilsController} from "../controller/utils.controller";

const router = new Router();

router.post('admin_upload', UtilsController.adminUploadImg);

export const utilsRouter = router;