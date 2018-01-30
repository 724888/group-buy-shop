import fetch from "node-fetch";

import {settings} from "../config/config.dev";

import {User, IUser} from "../model/user.model";

import {sign, verify} from "jsonwebtoken";

import * as md5 from "js-md5";

import * as createHttpError from "http-errors";

import {Context} from "koa";

export class AuthService {
    static async getUserOpenid(code: string): Promise<string | null> {
        const res = await fetch(`https://api.weixin.qq.com/sns/jscode2session?appid=${settings.appid}&secret=${settings.secret}&js_code=${code}&grant_type=authorization_code`);
        const data = await res.json();
        if ('openid' in data) {
            return data.openid
        } else {
            return null
        }
    }

    static async getUserFromOpenId(openid: string): Promise<IUser | null> {
        return await User.findOne({openid: openid}, {password: 0})
    }

    static async getUserFromId(id: string): Promise<IUser> {
        try {
            return await User.findOne({_id: id}, {password: 0})
        } catch (err) {
            throw createHttpError(401)
        }
    }

    static jwtSign(user: IUser): string {
        return sign({_id: user._id, usertype: user.usertype}, settings.jwtsecret, {
            expiresIn: '30d'
        })
    }

    static async saveUser(openid: string, usertype: number, username?: string, password?: string): Promise<IUser> {
        const u = new User({
            openid: openid,
            usertype: usertype,
            username: username,
            password: password
        });
        return await u.save()
    }

    static async checkUsernameIfRepeat(username: string): Promise<boolean> {
        const num = await User.count({username: username});
        return num === 0
    }

    static async updateUser(_id: string, username: string, usertype: number): Promise<IUser> {
        return await User.findOneAndUpdate({_id: _id}, {username: username, usertype: usertype}, {
            new: true
        })
    }

    static async authUser(username: string, password: string): Promise<IUser> {
        const u = await User.findOne({username: username, password: md5(password), usertype: {$in: [1, 2]}});
        if (u) {
            return u
        } else {
            throw createHttpError(401)
        }
    }

    static async getUserFormHeaderToken(ctx: Context): Promise<IUser> {
        const payload = verify(ctx.header.authorization.split(' ')[1], settings.jwtsecret);
        return await AuthService.getUserFromId(payload['_id']);
    }

    static async adminGetuserFromHeaderToken(ctx: Context): Promise<IUser> {
        try {
            const payload = verify(ctx.header.authorization.split(' ')[1], settings.jwtsecret);
            const user = await AuthService.getUserFromId(payload['_id']);
            return AuthService.checkIfAdminUser(user);
        } catch (err) {
            throw createHttpError(401)
        }
    }

    static async getAdminUser(user: IUser): Promise<Array<IUser>> {
        if (user.usertype === 1) {
            return await User.find({usertype: {$in: [1,2]}}, {password: 0});
        } else {
            return [user]
        }
    }

    static async checkIfAdminUser(user: IUser): Promise<IUser> {
        if (user.usertype !==1 && user.usertype !== 2) {
            throw createHttpError(401)
        } else {
            return user
        }
    }
}


