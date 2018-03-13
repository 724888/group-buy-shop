import {AuthService} from "../service/auth.service";
import {User} from "../model/user.model";
import * as md5 from "js-md5";

export class AuthController {
    static async getOpenid(ctx, next) {
        const code = ctx.request.body.code;
        const openid = await AuthService.getUserOpenid(code);
        if (openid) {
            const user = await AuthService.getUserFromOpenId(openid);
            if (user) {
                ctx.body = {
                    status: 2,
                    msg: '该用户已经注册过',
                    token: AuthService.jwtSign(user),
                    usertype: user.usertype,
                    username: user.username,
                    gen_time: new Date().getTime(),
                }
            } else {
                const newUser = await AuthService.saveUser(openid, 3);
                ctx.body = {
                    status: 1,
                    msg: '该用户首次使用，需补全手机号',
                    token: AuthService.jwtSign(newUser),
                    usertype: newUser.usertype,
                    gen_time: new Date().getTime()
                }
            }
        } else {
            ctx.throw(400, '无效的code')
        }
    }

    static async completeInformation(ctx, next) {
        const username = ctx.request.body.username;
        const check = await AuthService.checkUsernameIfRepeat(username);
        if (check) {
            const user = await AuthService.updateUser(ctx.state.user._id, username, ctx.state.user.usertype);
            ctx.body = {
                status: 1,
                token: AuthService.jwtSign(user),
                usertype: user.usertype,
                username: user.username,
                gen_time: new Date().getTime()
            }
        } else {
            ctx.throw(400, '无效的联系方式或该联系方式已被占用')
        }
    }

    static async adminLogin(ctx, next) {
        const {username, password} = ctx.request.body;
        const u = await AuthService.authUser(username, password);
        ctx.body = {
            status: 1,
            token: AuthService.jwtSign(u),
            usertype: u.usertype,
            gen_time: new Date().getTime()
        }
    }


    static async adminGetAdminUser(ctx, next) {
        const user = await AuthService.getUserFormHeaderToken(ctx);
        ctx.body = await AuthService.getAdminUser(user)
    }

    static async adminGetUser(ctx, next) {
        ctx.body = await AuthService.getUserFromId(ctx.params.id)
    }

    static async adminGetAllUser(ctx, next) {
        const page = ctx.query.page | 1;
        ctx.body = await AuthService.getUsers(Number(page))
    }

    static async adminSearchUser(ctx, next) {
        const username = ctx.request.body.username;
        ctx.body = await AuthService.getUsersFromUsername(username)
    }

    static async adminUpdateUser(ctx, next) {
        switch (ctx.request.body.type) {
            case 3: {
                ctx.body = await User.findOneAndUpdate({_id: ctx.params.id}, {password: md5(ctx.request.body.password), usertype: 2}, {
                    new: true
                });
                break;
            }
        }
    }
}