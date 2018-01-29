import * as Router from "koa-router";
import {authRouter} from "./auth.router";

const router = new Router();

router.use('/api/', authRouter.routes());

export const mainRouter = router;