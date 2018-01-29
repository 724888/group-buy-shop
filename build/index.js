"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const config_dev_1 = require("./config/config.dev");
const unauth_1 = require("./middleware/unauth");
const staticServe = require("koa-static");
const jwt = require("koa-jwt");
const koaBody = require("koa-body");
const bodyParser = require("koa-bodyparser");
const json = require("koa-json");
const router_1 = require("./router");
const bad_1 = require("./middleware/bad");
const app = new Koa;
app.use(json());
app.use(unauth_1.unauth);
app.use(bad_1.badrequest);
app.use(staticServe(__dirname + '/static'));
app.use(jwt({ secret: config_dev_1.settings.jwtsecret })
    .unless({
    path: [
        /^\/api\/login/,
        /^\/api\/adminlogin/,
        /^\/api\/code/,
        /^\/api\/adminsignup/,
        /^\/api\/order\/notify/
    ],
    method: 'GET'
}));
app.use(koaBody({ multipart: true }));
app.use(bodyParser());
app.use(router_1.mainRouter.routes()).use(router_1.mainRouter.allowedMethods());
app.listen(config_dev_1.settings.port);
//# sourceMappingURL=index.js.map