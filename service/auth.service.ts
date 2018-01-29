import fetch from "node-fetch";

import {settings} from "../config/config.dev";

import {User, IUser} from "../model/user.model";

import {sign} from "jsonwebtoken";

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
        try {
            return await User.findOne({openid: openid})
        } catch {
            return null
        }
    }

    static jwtSign(user: IUser): string {
        return sign({_id: user._id, usertype: user.usertype}, settings.jwtsecret, {
            expiresIn: '30d'
        })
    }

    static async saveUser(openid: string, usertype: number, username?: string, password?: string): Promise<IUser> {
        try {
            const u = new User({
                openid: openid,
                usertype: usertype,
                username: username,
                password: password
            });
            return await u.save()
        } catch (err) {
            console.log(err)
        }
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
}


