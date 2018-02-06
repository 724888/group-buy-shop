import * as Router from "koa-router";

import {GroupController} from "../controller/group.controller";

const router = new Router();


// For Administrators

router.post('admin_groups', GroupController.adminCreateGroup);

export const groupRouter = router;