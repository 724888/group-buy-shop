import * as Router from "koa-router";

import {GroupController} from "../controller/group.controller";

const router = new Router();


// For Administrators

router.post('admin_groups', GroupController.adminCreateGroup);

router.get('admin_groups/communities/:id', GroupController.adminGetGroupFromCommunity);

router.patch('admin_groups/:id', GroupController.adminUpdateGroup);

export const groupRouter = router;