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
const node_fetch_1 = require("node-fetch");
const config_dev_1 = require("../config/config.dev");
const user_model_1 = require("../model/user.model");
const jsonwebtoken_1 = require("jsonwebtoken");
const md5 = require("js-md5");
const createHttpError = require("http-errors");
class AuthService {
    static getUserOpenid(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield node_fetch_1.default(`https://api.weixin.qq.com/sns/jscode2session?appid=${config_dev_1.settings.appid}&secret=${config_dev_1.settings.secret}&js_code=${code}&grant_type=authorization_code`);
            const data = yield res.json();
            if ('openid' in data) {
                return data.openid;
            }
            else {
                return null;
            }
        });
    }
    static getUserFromOpenId(openid) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.User.findOne({ openid: openid }, { password: 0 });
        });
    }
    static getUserFromId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield user_model_1.User.findOne({ _id: id }, { password: 0 });
            }
            catch (err) {
                throw createHttpError(401);
            }
        });
    }
    static jwtSign(user) {
        return jsonwebtoken_1.sign({ _id: user._id, usertype: user.usertype }, config_dev_1.settings.jwtsecret, {
            expiresIn: '30d'
        });
    }
    static saveUser(openid, usertype, username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const u = new user_model_1.User({
                openid: openid,
                usertype: usertype,
                username: username,
                password: password
            });
            return yield u.save();
        });
    }
    static checkUsernameIfRepeat(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const num = yield user_model_1.User.count({ username: username });
            return num === 0;
        });
    }
    static updateUser(_id, username, usertype) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.User.findOneAndUpdate({ _id: _id }, { username: username, usertype: usertype }, {
                new: true
            });
        });
    }
    static authUser(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const u = yield user_model_1.User.findOne({ username: username, password: md5(password), usertype: { $in: [1, 2] } });
            if (u) {
                return u;
            }
            else {
                throw createHttpError(401);
            }
        });
    }
    static getUserFormHeaderToken(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = jsonwebtoken_1.verify(ctx.header.authorization.split(' ')[1], config_dev_1.settings.jwtsecret);
            return yield AuthService.getUserFromId(payload['_id']);
        });
    }
    static adminGetuserFromHeaderToken(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = jsonwebtoken_1.verify(ctx.header.authorization.split(' ')[1], config_dev_1.settings.jwtsecret);
                const user = yield AuthService.getUserFromId(payload['_id']);
                return AuthService.checkIfAdminUser(user);
            }
            catch (err) {
                throw createHttpError(401);
            }
        });
    }
    static getAdminUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user.usertype === 1) {
                return yield user_model_1.User.find({ usertype: { $in: [1, 2] } }, { password: 0 });
            }
            else {
                return [user];
            }
        });
    }
    static checkIfAdminUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user.usertype !== 1 && user.usertype !== 2) {
                throw createHttpError(401);
            }
            else {
                return user;
            }
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map