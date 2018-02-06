import * as Koa from 'koa'

import {settings} from "./config/config.dev";

import {unauth} from "./middleware/unauth";

import * as jwt from "koa-jwt";

import * as koaBody from "koa-body";

import * as bodyParser from "koa-bodyparser";

import * as json from "koa-json";

import {mainRouter} from "./router";

import {badrequest} from "./middleware/bad";

import * as serve from "koa-static";

import {admin_auth} from "./middleware/admin_auth";

const app = new Koa;

app.use(json());

app.use(unauth);

app.use(badrequest);

app.use(serve(__dirname + './../static'));

app.use(
    jwt({secret: settings.jwtsecret})
        .unless({
            path: [
                /^\/api\/login/,
                /^\/api\/admin_login/,
                /^\/api\/code/,
                /^\/api\/adminsignup/,
                /^\/api\/order\/notify/
            ],
            method: 'GET'
        })
);

app.use(koaBody({multipart: true}));

app.use(bodyParser());

app.use(admin_auth);

app.use(mainRouter.routes()).use(mainRouter.allowedMethods());

app.listen(settings.port);