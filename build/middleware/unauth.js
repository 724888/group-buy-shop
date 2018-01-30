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
function unauth(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        return next()
            .catch((err) => {
            if (err.status === 401) {
                ctx.status = 401;
                ctx.body = {
                    status: 0,
                    errcode: 1000,
                    errmsg: '认证失败，请重新认证获取token',
                    url: ctx.url
                };
            }
            else {
                throw err;
            }
        });
    });
}
exports.unauth = unauth;
//# sourceMappingURL=unauth.js.map