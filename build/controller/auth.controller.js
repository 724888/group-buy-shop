"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = require("../service/auth.service");
class AuthController {
    static getOpenid(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const code = ctx.request.body.code;
            const openid = yield auth_service_1.AuthService.getUserOpenid(code);
            if (openid) {
                const user = yield auth_service_1.AuthService.getUserFromOpenId(openid);
                if (user) {
                    ctx.body = {
                        status: 2,
                        msg: '该用户已经注册过',
                        token: auth_service_1.AuthService.jwtSign(user),
                        usertype: user.usertype,
                        gen_time: new Date().getTime(),
                    };
                }
                else {
                    const newUser = yield auth_service_1.AuthService.saveUser(openid, 3);
                    ctx.body = {
                        status: 1,
                        msg: '该用户首次使用，需补全手机号',
                        token: auth_service_1.AuthService.jwtSign(newUser),
                        usertype: newUser.usertype,
                        gen_time: new Date().getTime()
                    };
                }
            }
            else {
                ctx.throw(400, '无效的code');
            }
        });
    }
    static completeInformation(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const username = ctx.request.body.username;
            const check = yield auth_service_1.AuthService.checkUsernameIfRepeat(username);
            if (check) {
                const user = yield auth_service_1.AuthService.updateUser(ctx.state.user._id, username, ctx.state.user.usertype);
                ctx.body = {
                    status: 1,
                    token: auth_service_1.AuthService.jwtSign(user),
                    usertype: user.usertype,
                    gen_time: new Date().getTime()
                };
            }
            else {
                ctx.throw(400, '无效的联系方式或该联系方式已被占用');
            }
        });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map